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

    create(data: Partial<Lead>): Promise<Lead> {
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
}
