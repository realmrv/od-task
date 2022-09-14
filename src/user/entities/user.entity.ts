import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column({ length: 100, unique: true, nullable: false })
  email: string;

  @Column({ length: 100, nullable: false })
  password: string;

  @Column({ length: 30, unique: true, nullable: false })
  nickname: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;
}
