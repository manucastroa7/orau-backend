import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @Post('contact')
    async sendContactEmail(@Body() body: { productId: string; productName: string; userName: string; userEmail: string; message: string }) {
        return this.mailService.sendContactEmail(body);
    }
}
