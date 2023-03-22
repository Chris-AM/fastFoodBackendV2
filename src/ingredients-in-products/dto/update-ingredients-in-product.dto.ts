import { PartialType } from '@nestjs/swagger';
import { CreateIngredientsInProductDto } from './create-ingredients-in-product.dto';

export class UpdateIngredientsInProductDto extends PartialType(CreateIngredientsInProductDto) {}
