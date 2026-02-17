import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { SalesModule } from './sales/sales.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from './mail/mail.module';
import { LeadsModule } from './leads/leads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        const databaseUrl = configService.get('DATABASE_URL');

        console.log('Database Config:', {
          url: databaseUrl ? 'SET (hidden)' : 'NOT SET',
          host: configService.get('DB_HOST') || 'localhost',
          port: configService.get('DB_PORT') || 5432,
          ssl: isProduction || databaseUrl ? 'ENABLED' : 'DISABLED'
        });

        return {
          type: 'postgres',
          url: databaseUrl,
          host: configService.get('DB_HOST') || 'localhost',
          port: parseInt(configService.get('DB_PORT') || '5432', 10),
          username: configService.get('DB_USER') || 'postgres',
          password: configService.get('DB_PASSWORD') || 'postgres',
          database: configService.get('DB_NAME') || 'orgullo_austral',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true, // Auto-create tables (dev only)
          ssl: databaseUrl ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    CloudinaryModule,
    ProductsModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    SalesModule,
    MailModule,
    LeadsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
