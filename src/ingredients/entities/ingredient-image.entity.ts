import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Ingredient } from '.';

@Entity({ name: 'ingredient_images' })
export class IngredientImage {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('text')
  url: string;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.images, {
    onDelete: 'CASCADE',
  })
  ingredient: Ingredient;
}
