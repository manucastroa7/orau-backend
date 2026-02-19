import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Lead {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    message: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    productName: string;

    @Column({ nullable: true })
    productId: string;

    @Column({ default: 'new' })
    status: string; // new, contacted, closed

    @CreateDateColumn()
    createdAt: Date;
}
