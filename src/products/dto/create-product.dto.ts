import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: 'Product Name. Cannot be lower than 3 chars',
    nullable: false,
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Product description',
    nullable: true,
  })
  description?: string;

  @IsInt()
  @ApiProperty({
    description: 'Product price',
    nullable: false,
  })
  price: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Is product still available (default: true)',
    nullable: true,
  })
  inStock?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Product slug (default: product name)',
    nullable: true,
  })
  slug?: string;

  @IsString({ each: true })
  @IsArray()
  @ApiProperty({
    description: 'Product ingredients',
    nullable: false,
  })
  ingredients: string[];

  @IsString({ each: true })
  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Product images',
    nullable: true,
  })
  images?: string[];
}
