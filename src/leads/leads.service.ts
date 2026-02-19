import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './lead.entity';

@Injectable()
export class LeadsService {
    constructor(
        @InjectRepository(Lead)
        private leadsRepository: Repository<Lead>,
    ) { }

    async create(data: { name: string; email: string; message: string; productName?: string; productId?: string; status?: string; phone?: string }) {
        const lead = this.leadsRepository.create(data);
        return this.leadsRepository.save(lead);
    }

    findAll(): Promise<Lead[]> {
        return this.leadsRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async updateStatus(id: string, status: string): Promise<Lead> {
        await this.leadsRepository.update(id, { status });
        return this.leadsRepository.findOneByOrFail({ id });
    }

    async remove(id: string): Promise<void> {
        await this.leadsRepository.delete(id);
    }
}
