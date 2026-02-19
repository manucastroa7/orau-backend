import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Section } from './entities/section.entity';

@Injectable()
export class SectionsService {
    constructor(
        @InjectRepository(Section)
        private sectionsRepository: Repository<Section>,
    ) { }

    async create(createSectionDto: CreateSectionDto): Promise<Section> {
        const section = this.sectionsRepository.create(createSectionDto);
        // Auto-set order to last if not provided
        if (!section.order) {
            const count = await this.sectionsRepository.count();
            section.order = count;
        }
        return this.sectionsRepository.save(section);
    }

    async findAll(): Promise<Section[]> {
        return this.sectionsRepository.find({
            order: {
                order: 'ASC',
            },
            where: {
                isActive: true, // By default return robust active sections, or handle this in controller for admin
            }
        });
    }

    // For admin: find all including inactive
    async findAllAdmin(): Promise<Section[]> {
        return this.sectionsRepository.find({
            order: { order: 'ASC' }
        });
    }

    async findOne(id: string): Promise<Section> {
        const section = await this.sectionsRepository.findOne({ where: { id } });
        if (!section) {
            throw new NotFoundException(`Section with ID ${id} not found`);
        }
        return section;
    }

    async update(id: string, updateSectionDto: UpdateSectionDto): Promise<Section> {
        const section = await this.findOne(id);
        Object.assign(section, updateSectionDto);
        return this.sectionsRepository.save(section);
    }

    async remove(id: string): Promise<void> {
        const section = await this.findOne(id);
        await this.sectionsRepository.remove(section);
    }
}
