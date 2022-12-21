import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IngredientImage } from './';

@Entity()
export class Ingredient {
  //* COLUMNS
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  name: string;

  @Column('text', {
    array: true,
    default: [],
  })
  type: string[];

  @Column('text', { nullable: true })
  description: string;

  @Column('boolean', {
    default: false,
  })
  inStock: boolean;

  @OneToMany(
    () => IngredientImage,
    (ingregientImgage) => ingregientImgage.ingredient,
    { cascade: true, eager: true },
  )
  images: IngredientImage[];

  @Column('text', {
    unique: true,
  })
  slug?: string;

  //* VALIDATIONS
  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.name;
    }
    this.checkSlugUpdate();
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
