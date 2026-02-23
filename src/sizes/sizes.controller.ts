import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { SizesService } from './sizes.service';
import { Size } from './size.entity';

@Controller('sizes')
export class SizesController {
    constructor(private readonly sizesService: SizesService) { }

    @Get()
    findAll() {
        return this.sizesService.findAll();
    }

    @Post()
    create(@Body() size: Partial<Size>) {
        return this.sizesService.create(size);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() size: Partial<Size>) {
        return this.sizesService.update(id, size);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.sizesService.remove(id);
    }
}
