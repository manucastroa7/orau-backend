import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum SectionType {
    PRODUCT_GRID = 'PRODUCT_GRID',
    BANNER = 'BANNER',
    TEXT = 'TEXT',
}

@Entity()
export class Section {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    subtitle: string;

    @Column({
        type: 'enum',
        enum: SectionType,
        default: SectionType.PRODUCT_GRID,
    })
    type: SectionType;

    @Column('jsonb', { nullable: true })
    content: any; // Stores dynamic configuration (e.g., categoryId, imageUrl, textBody)

    @Column({ default: 0 })
    order: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
