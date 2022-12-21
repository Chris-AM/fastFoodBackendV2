import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Ingredient } from '.';

@Entity()
export class IngredientImage {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('text')
  url: string;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.images)
  ingredient: Ingredient;
}
