//! Nest Modules
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
//! Own Files
import { IngredientsInProductsService } from './ingredients-in-products.service';
import { IngredientsInProductsController } from './ingredients-in-products.controller';
import { IngredientsInProduct } from "./entities/ingredients-in-product.entity";

@Module({
  controllers: [IngredientsInProductsController],
  providers: [IngredientsInProductsService],
  imports: [
    TypeOrmModule.forFeature([IngredientsInProduct]),
  ],
  exports: [IngredientsInProductsService],
})

export class IngredientsInProductsModule {}
