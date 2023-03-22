import { Column, ManyToOne, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { Product } from ".";

@Entity({ name: 'product_images' })
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('text')
  url: string;

  @ManyToOne(() => Product, (product) => product.images)
  product: Product;
}