import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  @MinLength(3)
  name: string;
  @IsIn(['Verduras/Frutas', 'Carnes', 'Quesos', 'Salsas', 'Panes', 'Panes'])
  type: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsBoolean()
  @IsOptional()
  inStock?: boolean;
  @IsString()
  @IsOptional()
  slug?: string;
}
