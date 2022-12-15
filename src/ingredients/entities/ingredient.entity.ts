import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text', {
    unique: true,
  })
  name: string;
  @Column('text')
  type: string;
  @Column('text')
  description: string;
  @Column('boolean', {
    default: false,
  })
  inStock: boolean;
  @Column('text')
  image: string;
  @Column('text', {
    unique: true,
  })
  slug: string;
}
