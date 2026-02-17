import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'jsonb', default: {} })
    stock: Record<string, number>;

    @Column('simple-array')
    sizes: string[];

    @Column('simple-array', { nullable: true })
    images: string[];

    @ManyToOne(() => Category, (category) => category.products, { eager: true, nullable: true })
    categoryRelation: Category;

    @CreateDateColumn()
    createdAt: Date;
}
