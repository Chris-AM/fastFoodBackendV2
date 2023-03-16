import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Ingredient } from '../../ingredients/entities/ingredient.entity';
import { UserAvatar } from './user-image.entity';
@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  fullName: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @Column('text', { nullable: true })
  phone?: string;

  @OneToMany(
    () => UserAvatar,
    (userAvatar) => userAvatar.user,
    { cascade: true, eager: true }
  )
  avatar?: UserAvatar;

  @Column('text', { nullable: true })
  address?: string;

  @OneToMany(() => Ingredient, (ingredient) => ingredient.user)
  ingredient: Ingredient;

  @BeforeInsert()
  checkEmailCasingBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }
  @BeforeUpdate()
  checkEmailCasingBeforeUpdate() {
    this.checkEmailCasingBeforeInsert();
  }
}
