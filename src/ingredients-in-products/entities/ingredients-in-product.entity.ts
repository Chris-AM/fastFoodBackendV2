import { Ingredient } from 'src/ingredients/entities';
import { Product } from 'src/products/entities/product.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ingredients_in_products' })
export class IngredientsInProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Ingredient, (ingredient) => ingredient.ingredientsInProduct)
  ingredients: Ingredient[];
  @ManyToOne(() => Product, (product) => product.ingredientsInProduct)
  products: Product[];
}
