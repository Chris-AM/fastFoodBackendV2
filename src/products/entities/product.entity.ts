//! Nest Imports
import { ApiProperty } from '@nestjs/swagger';
//! Third Party Imports
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
//! Own Imports
import { ProductImage } from '.';
import { Ingredient } from '../../ingredients/entities/';
import { User } from 'src/user/entities';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '14e89521-879f-4d55-8f61-b429dea40dd4',
    description: 'Product ID (uuid)',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Hamburguesa Clásica',
    description: 'Nombre del producto',
  })
  @Column('text', { unique: true })
  name: string;

  @ApiProperty({
    example: 'Hamburguesa de carne. La típica de la casa.',
    description:
      'Descripción del producto. Por defecto serán los ingredientes del producto.',
  })
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({
    example: '4990',
    description: 'Precio del producto',
  })
  @Column('integer', { default: 0 })
  price: number;

  @ApiProperty({
    example: 'True',
    description: '¿Está disponible el producto?',
  })
  @Column('boolean', { default: true })
  inStock: boolean;

  @ApiProperty()
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    eager: true,
    cascade: true,
  })
  images: ProductImage[];

  @ApiProperty()
  @ManyToMany(() => Ingredient, (ingredient) => ingredient.products)
  @JoinTable({
    name: 'product_ingredients',
    joinColumn: { name: 'productId' },
    inverseJoinColumn: { name: 'ingredientId' },
  })
  ingredients: Ingredient[];

  @ApiProperty({
    example: 'hamburguesa_clasica',
    description: 'product slug',
  })
  @Column('text', {
    unique: true,
  })
  slug?: string;

  @ApiProperty({
    example: 'Dev User',
    description: 'Nombre del usuario que creó el producto',
  })
  @ManyToOne(() => User, (user) => user.products, { eager: true })
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
