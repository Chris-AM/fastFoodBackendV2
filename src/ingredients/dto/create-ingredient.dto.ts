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
  name: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  type: string[];

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  inStock?: boolean;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
