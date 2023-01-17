import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IngredientImage } from './';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'ingredients' })
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

  @ManyToOne(() => User, (user) => user.ingredient, { eager: true })
  user: User;

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
