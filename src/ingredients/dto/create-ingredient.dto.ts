import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: 'Ingredient Name. Cannot be lower than 3 chars',
    nullable: false,
  })
  name: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @ApiProperty({
    description: 'Ingredient type',
    nullable: true,
  })
  type: string[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Ingredient description',
    nullable: true,
  })
  description?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Is ingredient still available (default: true)',
    nullable: true,
  })
  inStock?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Ingredient slug (default: ingredient name)',
    nullable: true,
  })
  slug?: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @ApiProperty({
    description: 'Ingredient images',
    nullable: true,
  })
  images?: string[];
}
