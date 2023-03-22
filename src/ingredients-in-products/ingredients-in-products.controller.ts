import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IngredientsInProductsService } from './ingredients-in-products.service';
import { CreateIngredientsInProductDto } from './dto/create-ingredients-in-product.dto';
import { UpdateIngredientsInProductDto } from './dto/update-ingredients-in-product.dto';

@Controller('ingredients-in-products')
export class IngredientsInProductsController {
  constructor(private readonly ingredientsInProductsService: IngredientsInProductsService) {}

  @Post()
  create(@Body() createIngredientsInProductDto: CreateIngredientsInProductDto) {
    return this.ingredientsInProductsService.create(createIngredientsInProductDto);
  }

  @Get()
  findAll() {
    return this.ingredientsInProductsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ingredientsInProductsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIngredientsInProductDto: UpdateIngredientsInProductDto) {
    return this.ingredientsInProductsService.update(+id, updateIngredientsInProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ingredientsInProductsService.remove(+id);
  }
}
