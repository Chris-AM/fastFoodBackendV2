//!Nest Importos
import { ApiProperty } from "@nestjs/swagger";
//!Node Imports
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
//!Own Imports
import { IngredientImage } from './';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'ingredients' })
export class Ingredient {
  //* COLUMNS
  @ApiProperty({
    example: '14e89521-879f-4d55-8f61-b429dea40dd4',
    description: 'Ingredient ID (uuid)',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Pepinillos',
    description: 'Ingredient Name',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  name: string;

  @ApiProperty({
    example: '[ "Verduras/Frutas", "Base" ]',
    description: 'Array of ingredients types',
  })
  @Column('text', {
    array: true,
    default: [],
  })
  type: string[];

  @ApiProperty({
    example: 'Base para varios',
    description: 'What the ingredient is used for',
  })
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({
    example: 'True',
    description: 'Is the ingredient available?',
  })
  @Column('boolean', {
    default: false,
  })
  inStock: boolean;

  @ApiProperty({
    example: '["pepinillos_2.jpeg", "pepinillos_1.jpeg"]',
    description: 'Ingredient array of images',
  })
  @OneToMany(
    () => IngredientImage,
    (ingregientImgage) => ingregientImgage.ingredient,
    { cascade: true, eager: true },
  )
  images: IngredientImage[];

  @ApiProperty({
    example: 'pepinillos',
    description: 'Ingredient slug',
  })
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
