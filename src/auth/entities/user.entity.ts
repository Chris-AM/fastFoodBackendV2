import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Users')
export class User {
    @PrimaryColumn('uuid')
    id: string;
    @Column('text', {
        unique: true
    })
    email: string;
    password: string;
    @Column('text')
    fullName: string;
    @Column('bool', {
        default: true
    })
    isActive: string;
    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];
    @Column('text')
    phone: string;
    @Column('text')
    avatar?: string;
    @Column('text')
    address?:string;
}
