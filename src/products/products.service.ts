import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        private cloudinaryService: CloudinaryService,
    ) { }

    async uploadImage(file: Express.Multer.File) {
        return this.cloudinaryService.uploadImage(file);
    }

    async findAll(): Promise<Product[]> {
        const products = await this.productsRepository.find({ order: { createdAt: 'DESC' } });
        return products.map(product => ({
            ...product,
            images: product.images || [],
            category: product.categoryRelation ? product.categoryRelation.name : 'Sin Categoría',
            sizes: product.sizesRelation ? product.sizesRelation.map(s => s.name) : []
        }));
    }

    findOne(id: string): Promise<Product | null> {
        return this.productsRepository.findOneBy({ id });
    }

    create(product: Partial<Product>): Promise<Product> {
        const newProduct = this.productsRepository.create(product);
        return this.productsRepository.save(newProduct);
    }

    async update(id: string, productData: Partial<Product>): Promise<Product | null> {
        const product = await this.productsRepository.findOneBy({ id });
        if (!product) return null;

        const updatedProduct = this.productsRepository.merge(product, productData);
        await this.productsRepository.save(updatedProduct);
        return this.findAll().then(products => products.find(p => p.id === id) || null);
    }

    async remove(id: string): Promise<void> {
        await this.productsRepository.delete(id);
    }
}
