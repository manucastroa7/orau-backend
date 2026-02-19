import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) { }

    create(category: Partial<Category>): Promise<Category> {
        const newCategory = this.categoriesRepository.create(category);
        return this.categoriesRepository.save(newCategory);
    }

    findAll(): Promise<Category[]> {
        return this.categoriesRepository.find();
    }

    findOne(id: string): Promise<Category | null> {
        return this.categoriesRepository.findOneBy({ id });
    }

    async update(id: string, category: Partial<Category>): Promise<Category> {
        await this.categoriesRepository.update(id, category);
        return this.categoriesRepository.findOneByOrFail({ id });
    }

    async remove(id: string): Promise<void> {
        await this.categoriesRepository.delete(id);
    }
}
