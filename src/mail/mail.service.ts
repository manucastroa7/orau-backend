import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

import { LeadsService } from '../leads/leads.service';

@Injectable()
export class MailService {
    private transporter;

    constructor(
        private configService: ConfigService,
        private leadsService: LeadsService
    ) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get('MAIL_USER'),
                pass: this.configService.get('MAIL_PASS'),
            },
        });
    }

    async sendContactEmail(data: { productId: string; productName: string; userName: string; userEmail: string; message: string; phone?: string }) {
        try {
            console.log('Raw data received:', data);

            if (!data) {
                console.error('No data received in body');
                throw new Error('No data received');
            }

            console.log('Received contact request for:', data.productName);

            // Process everything in background (Fire and forget)
            this.processContactRequestInBackground(data).catch(err => {
                console.error('Error in background processing:', err);
            });

            // Return immediately to the frontend
            return { success: true, message: 'Request received' };
        } catch (error) {
            console.error('Error in sendContactEmail (sync):', error);
            throw error;
        }
    }

    private async processContactRequestInBackground(data: { productId: string; productName: string; userName: string; userEmail: string; message: string; phone?: string }) {
        const { productId, productName, userName, userEmail, message, phone } = data;

        // 1. Save Lead
        try {
            console.time('saveLead');
            await this.leadsService.create({
                name: userName,
                email: userEmail,
                message,
                productName,
                productId,
                status: 'new',
                phone
            });
            console.timeEnd('saveLead');
        } catch (err) {
            console.error('Error saving lead:', err);
        }

        // 2. Send Admin Notification
        try {
            console.time('sendAdminMail');
            await this.transporter.sendMail({
                from: '"ORAU Web" <orau.orgulloaustral@gmail.com>',
                to: 'orau.orgulloaustral@gmail.com',
                subject: `Nueva consulta: ${productName}`,
                html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fdfcf9; color: #18181b; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e4e4e7; }
                    .header { background-color: #18181b; padding: 20px; text-align: center; color: #fff; }
                    .content { padding: 30px; }
                    .label { font-size: 10px; uppercase; letter-spacing: 0.2em; color: #a1a1aa; font-weight: 700; margin-bottom: 5px; }
                    .value { font-size: 16px; margin-bottom: 20px; }
                    .message { background-color: #f4f4f5; padding: 15px; font-style: italic; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">NUEVA CONSULTA</div>
                    <div class="content">
                        <div class="label">PRODUCTO</div>
                        <div class="value">${productName} <span style="color:#71717a; font-size:12px;">(${productId})</span></div>
                        
                        <div class="label">CLIENTE</div>
                        <div class="value">
                            ${userName}<br>
                            <a href="mailto:${userEmail}" style="color:#C5A059;">${userEmail}</a>
                            ${phone ? `<br><span style="font-size: 14px; color: #71717a;">Tel: ${phone}</span>` : ''}
                        </div>
                        
                        <div class="label">MENSAJE</div>
                        <div class="message">"${message}"</div>
                    </div>
                </div>
            </body>
            </html>
          `,
            });
            console.log('Admin email sent.');
            console.timeEnd('sendAdminMail');
        } catch (error) {
            console.error('Failed to send admin email:', error);
        }

        // 3. Send Customer Confirmation
        try {
            console.time('sendCustomerMail');
            await this.transporter.sendMail({
                from: '"ORAU" <orau.orgulloaustral@gmail.com>',
                to: userEmail,
                subject: `Recibimos tu consulta: ${productName}`,
                html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fdfcf9; color: #18181b; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e4e4e7; }
                    .header { background-color: #18181b; padding: 40px 20px; text-align: center; }
                    .logo { color: #ffffff; font-size: 24px; letter-spacing: 0.2rem; font-family: 'Times New Roman', serif; }
                    .content { padding: 40px 30px; text-align: center; }
                    .message { font-size: 16px; line-height: 1.6; color: #52525b; margin-bottom: 30px; }
                    .footer { font-size: 11px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #e4e4e7; padding: 20px; text-align: center; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">ORAU</div>
                    </div>
                    <div class="content">
                        <h2 style="font-weight: 300; font-size: 24px; margin-bottom: 20px;">Hola ${userName},</h2>
                        <p class="message">
                            Hemos recibido tu consulta sobre <strong>${productName}</strong>.
                            <br><br>
                            Nuestro equipo te responderá a la brevedad posible a este mismo correo.
                        </p>
                        <p style="color: #C5A059; font-style: italic; font-size: 14px;">"No es distancia. Es perspectiva."</p>
                    </div>
                    <div class="footer">
                        &copy; ${new Date().getFullYear()} Orgullo Austral
                    </div>
                </div>
            </body>
            </html>
          `,
            });
            console.log('Customer confirmation email sent.');
            console.timeEnd('sendCustomerMail');
        } catch (error) {
            console.error('Failed to send customer email:', error);
        }
    }
}
