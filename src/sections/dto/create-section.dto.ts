import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { SectionType } from '../entities/section.entity';

export class CreateSectionDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    subtitle?: string;

    @IsEnum(SectionType)
    @IsNotEmpty()
    type: SectionType;

    @IsOptional()
    content?: any;

    @IsNumber()
    @IsOptional()
    order?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
