import { Controller, Get, Patch, Param, Body, Post, Delete } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { Lead } from './lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';

@Controller('leads')
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) { }

    @Get()
    findAll(): Promise<Lead[]> {
        return this.leadsService.findAll();
    }

    @Post()
    create(@Body() lead: CreateLeadDto): Promise<Lead> {
        return this.leadsService.create(lead);
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: string): Promise<Lead> {
        return this.leadsService.updateStatus(id, status);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.leadsService.remove(id);
    }
}
