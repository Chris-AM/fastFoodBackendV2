import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_avatar' })
export class UserAvatar {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('text')
  url: string;

  @OneToOne(() => User, (user) => user.avatar, {
    onDelete: 'CASCADE',
  })
  user: User;
}
