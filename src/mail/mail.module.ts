import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

import { LeadsModule } from '../leads/leads.module';

@Module({
    imports: [LeadsModule],
    controllers: [MailController],
    providers: [MailService],
})
export class MailModule { }
