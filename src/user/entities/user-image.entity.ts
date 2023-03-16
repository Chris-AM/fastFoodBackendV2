import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({name: 'user_avatar'})
export class UserAvatar {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column('text')
    url: string;

    @ManyToOne(() => User, (user) => user.avatar, {
        onDelete: 'CASCADE',
    })
    user: User;
}