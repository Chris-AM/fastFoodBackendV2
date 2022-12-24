import { Injectable } from '@nestjs/common';
import { IngredientsService } from 'src/ingredients/ingredients.service';
import { seededData } from './mocks/ingredient.mock';
@Injectable()
export class SeedService {
  constructor(private readonly ingredientsService: IngredientsService) {}
  async runSeed() {
    await this.seedIngredients();
    return 'SEED EXCECUTED';
  }

  private async seedIngredients() {
    await this.ingredientsService.deleteAllProducts();
    const ingredientsToSeed = seededData.ingredients;
    const insertPromises = [];
    ingredientsToSeed.forEach((ingredient) => {
      insertPromises.push(this.ingredientsService.create(ingredient));
    });
    await Promise.all(insertPromises)
    return true;
  }
}
