import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Size } from './size.entity';

@Injectable()
export class SizesService {
    constructor(
        @InjectRepository(Size)
        private sizesRepository: Repository<Size>,
    ) { }

    findAll(): Promise<Size[]> {
        return this.sizesRepository.find({ order: { name: 'ASC' } });
    }

    create(size: Partial<Size>): Promise<Size> {
        const newSize = this.sizesRepository.create(size);
        return this.sizesRepository.save(newSize);
    }

    async update(id: string, size: Partial<Size>): Promise<Size | null> {
        await this.sizesRepository.update(id, size);
        return this.sizesRepository.findOneBy({ id });
    }

    async remove(id: string): Promise<void> {
        await this.sizesRepository.delete(id);
    }
}
