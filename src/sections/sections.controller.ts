import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

// In a real app, add @UseGuards(JwtAuthGuard) for write operations
// For now, keeping public GET for frontend, but we should secure writes.
@Controller('sections')
export class SectionsController {
    constructor(private readonly sectionsService: SectionsService) { }

    @Post()
    create(@Body() createSectionDto: CreateSectionDto) {
        return this.sectionsService.create(createSectionDto);
    }

    @Get()
    findAll() {
        return this.sectionsService.findAll();
    }

    @Get('admin')
    findAllAdmin() {
        return this.sectionsService.findAllAdmin();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.sectionsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSectionDto: UpdateSectionDto) {
        return this.sectionsService.update(id, updateSectionDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.sectionsService.remove(id);
    }
}
