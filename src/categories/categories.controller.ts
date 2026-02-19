import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    create(@Body() category: Partial<Category>) {
        return this.categoriesService.create(category);
    }



    @Patch(':id')
    update(@Param('id') id: string, @Body() category: Partial<Category>) {
        return this.categoriesService.update(id, category);
    }

    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(id);
    }
}
