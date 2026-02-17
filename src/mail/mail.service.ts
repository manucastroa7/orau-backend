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

    async sendContactEmail(data: { productId: string; productName: string; userName: string; userEmail: string; message: string }) {
        const { productId, productName, userName, userEmail, message } = data;

        // Save Lead
        try {
            await this.leadsService.create({
                name: userName,
                email: userEmail,
                message,
                productName,
                productId,
                status: 'new'
            });
        } catch (err) {
            console.error('Error saving lead:', err);
            // Don't block email sending if lead saving fails? Or maybe we should?
            // For now, log and proceed.
        }

        try {
            console.log('Attempting to send email to:', this.configService.get('MAIL_USER'));
            await this.transporter.sendMail({
                from: '"ORAU Web" <orau.orgulloaustral@gmail.com>',
                to: 'orau.orgulloaustral@gmail.com',
                subject: `Nueva consulta: ${productName}`,
                html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #333;">Nueva Consulta de Producto</h2>
                <hr style="border: 0; border-top: 1px solid #eee;" />
                <p><strong>Producto:</strong> ${productName}</p>
                <p><strong>ID:</strong> ${productId}</p>
                <br />
                <p><strong>Cliente:</strong> ${userName}</p>
                <p><strong>Email:</strong> <a href="mailto:${userEmail}">${userEmail}</a></p>
                <br />
                <p><strong>Mensaje:</strong></p>
                <p style="background: #f9f9f9; padding: 15px; border-radius: 5px; color: #555;">${message}</p>
            </div>
          `,
            });
            console.log('Email sent successfully');
            return { success: true };
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}
