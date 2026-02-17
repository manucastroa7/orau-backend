import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity()
export class Sale {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Product, { eager: true, onDelete: 'CASCADE' })
    product: Product;

    @Column()
    quantity: number;

    @Column()
    size: string;

    @Column('decimal', { precision: 10, scale: 2 })
    totalPrice: number;

    @Column({ nullable: true })
    paymentMethod: string;

    @Column({ nullable: true })
    customerName: string;

    @Column({ nullable: true })
    customerEmail: string;

    @Column({ nullable: true })
    customerPhone: string;

    @CreateDateColumn()
    date: Date;
}
