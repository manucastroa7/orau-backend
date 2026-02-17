import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async onModuleInit() {
        await this.seedAdminUser();
    }

    async seedAdminUser() {
        const adminEmail = 'orau.orgulloaustral@gmail.com';
        const existingAdmin = await this.usersRepository.findOne({ where: { email: adminEmail } });

        if (!existingAdmin) {
            console.log('Seeding admin user...');
            const admin = this.usersRepository.create({
                email: adminEmail,
                password: 'orgulloaustral', // Storing plain text as requested for now
                role: 'admin',
            });
            await this.usersRepository.save(admin);
            console.log('Admin user seeded successfully');
        } else {
            console.log('Admin user already exists');
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }
}
