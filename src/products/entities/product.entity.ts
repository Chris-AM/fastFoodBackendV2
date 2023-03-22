import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IngredientsInProduct } from '../../ingredients-in-products/entities/ingredients-in-product.entity';
import { ProductImage } from '.';

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
  @Column('boolean', { default: false })
  inStock: boolean;

  @ApiProperty()
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    eager: true,
    cascade: true,
  })
  images: ProductImage[];

  @ApiProperty({
    example: 'Dev User',
    description: 'Nombre del usuario que creó el producto',
  })
  @OneToMany(
    () => IngredientsInProduct,
    (ingredientsInProduct) => ingredientsInProduct.products,
    { eager: true, cascade: true },
  )
  ingredientsInProduct: IngredientsInProduct;

  @ManyToOne(() => User, (user) => user.products, { eager: true })
  user: User;
}
