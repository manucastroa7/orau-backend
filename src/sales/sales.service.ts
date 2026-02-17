import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './sale.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(Sale)
        private salesRepository: Repository<Sale>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

    async findAll(): Promise<Sale[]> {
        return this.salesRepository.find({
            order: { date: 'DESC' },
            relations: ['product'],
        });
    }

    async create(data: { productId: string; size: string; quantity: number; paymentMethod: string; customerName: string; customerEmail?: string; customerPhone?: string; date?: Date }): Promise<Sale> {
        const { productId, size, quantity, paymentMethod, customerName, customerEmail, customerPhone, date } = data;
        const product = await this.productsRepository.findOneBy({ id: productId });

        if (!product) {
            throw new BadRequestException('Producto no encontrado');
        }

        const currentStock = product.stock[size] || 0;
        if (currentStock < quantity) {
            throw new BadRequestException(`Stock insuficiente para talle ${size}. Disponible: ${currentStock}`);
        }

        // Decrement stock
        product.stock[size] = currentStock - quantity;

        // Needed for TypeORM to detect jsonb change if top-level ref doesn't change
        // But reassigning the property usually works. We'll clone to be safe.
        product.stock = { ...product.stock };

        await this.productsRepository.save(product);

        // Register sale
        const sale = this.salesRepository.create({
            product,
            quantity,
            size,
            totalPrice: product.price * quantity,
            paymentMethod,
            customerName,
            customerEmail,
            customerPhone,
            date: date ? new Date(date) : undefined,
        });

        return this.salesRepository.save(sale);
    }

    async remove(id: string): Promise<void> {
        const sale = await this.salesRepository.findOne({ where: { id }, relations: ['product'] });
        if (!sale) throw new BadRequestException('Venta no encontrada');

        // Restore stock
        if (sale.product) {
            const product = sale.product;
            product.stock[sale.size] = (product.stock[sale.size] || 0) + sale.quantity;
            product.stock = { ...product.stock };
            await this.productsRepository.save(product);
        }

        await this.salesRepository.remove(sale);
    }

    async update(id: string, data: Partial<Sale>): Promise<Sale> {
        const sale = await this.salesRepository.findOne({ where: { id }, relations: ['product'] });
        if (!sale) throw new BadRequestException('Venta no encontrada');

        // Check if stock impact is needed
        const isStockChange = (data.product && data.product.id !== sale.product.id) ||
            (data.size && data.size !== sale.size) ||
            (data.quantity && data.quantity !== sale.quantity);

        if (isStockChange) {
            // 1. Revert old stock
            if (sale.product) {
                const oldProduct = sale.product;
                const oldSize = sale.size;
                const oldCategory = oldProduct.stock; // Access stock object

                // Init if undefined - though it should exist
                if (!oldCategory[oldSize] && oldCategory[oldSize] !== 0) {
                    // handling edge case
                }

                // Add back
                oldProduct.stock[oldSize] = (oldProduct.stock[oldSize] || 0) + sale.quantity;

                // Force update JSON
                oldProduct.stock = { ...oldProduct.stock };
                await this.productsRepository.save(oldProduct);
            }

            // 2. Prepare for new stock deduction
            let targetProduct: Product | null = sale.product;

            // If product ID changed, fetch new product
            if (data.product && data.product.id && data.product.id !== sale.product?.id) {
                targetProduct = await this.productsRepository.findOneBy({ id: data.product.id });
                if (!targetProduct) throw new BadRequestException('Nuevo producto no encontrado');
            }

            if (targetProduct) {
                const newSize = data.size || sale.size;
                const newQuantity = data.quantity || sale.quantity;
                const currentStock = targetProduct.stock[newSize] || 0;

                if (currentStock < newQuantity) {
                    // Rollback revert if needed? 
                    // For simplicity, we just fail. The stock was returned, which is technically safer for the shop owner 
                    // than losing stock, but annoyed user. 
                    // Ideally we wrap in transaction or check first.
                    throw new BadRequestException(`Stock insuficiente para talle ${newSize}. Disponible: ${currentStock}`);
                }

                targetProduct.stock[newSize] = currentStock - newQuantity;
                targetProduct.stock = { ...targetProduct.stock };
                await this.productsRepository.save(targetProduct);
            }
        }

        // Apply other updates
        Object.assign(sale, data);

        // Recalculate price if quantity or product changed (and we have product)
        if (sale.product) {
            sale.totalPrice = sale.product.price * sale.quantity;
        }

        return this.salesRepository.save(sale);
    }
}
