import { Controller, Get, Post, Body, Param, Delete, Patch, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadImage(@UploadedFile() file: Express.Multer.File) {
        return this.productsService.uploadImage(file);
    }

    @Get()
    findAll() {
        return this.productsService.findAll();
    }

    @Post()
    create(@Body() product: Partial<Product>) {
        return this.productsService.create(product);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() product: Partial<Product>) {
        return this.productsService.update(id, product);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
