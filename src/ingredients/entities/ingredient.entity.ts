import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  @Column('text', { nullable: true })
  description: string;
  @Column('boolean', {
    default: false,
  })
  inStock: boolean;
  @Column('text', {
    nullable: true,
  })
  image: string;
  @Column('text', {
    unique: true,
  })
  slug?: string;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.name;
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
