import { Injectable } from '@nestjs/common';
import { CreateIngredientsInProductDto } from './dto/create-ingredients-in-product.dto';
import { UpdateIngredientsInProductDto } from './dto/update-ingredients-in-product.dto';

@Injectable()
export class IngredientsInProductsService {
  create(createIngredientsInProductDto: CreateIngredientsInProductDto) {
    return 'This action adds a new ingredientsInProduct';
  }

  findAll() {
    return `This action returns all ingredientsInProducts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ingredientsInProduct`;
  }

  update(id: number, updateIngredientsInProductDto: UpdateIngredientsInProductDto) {
    return `This action updates a #${id} ingredientsInProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} ingredientsInProduct`;
  }
}
