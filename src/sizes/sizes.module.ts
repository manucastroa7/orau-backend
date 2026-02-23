import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Size } from './size.entity';
import { SizesService } from './sizes.service';
import { SizesController } from './sizes.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Size])],
    providers: [SizesService],
    controllers: [SizesController],
    exports: [SizesService]
})
export class SizesModule { }
