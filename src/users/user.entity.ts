import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string; // In a real app this should be hashed, but for now we store plain text as per current auth service logic

    @Column({ default: 'user' })
    role: string;
}
