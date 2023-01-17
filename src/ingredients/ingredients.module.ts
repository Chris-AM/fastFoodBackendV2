//! Nest Modules
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
//! Own Files
import { AuthModule } from '../auth/auth.module';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';
import { Ingredient, IngredientImage } from './entities';

@Module({
  controllers: [IngredientsController],
  providers: [IngredientsService],
  imports: [
    TypeOrmModule.forFeature([Ingredient, IngredientImage]),
    AuthModule,
  ],
  exports: [IngredientsService],
})
export class IngredientsModule {}
