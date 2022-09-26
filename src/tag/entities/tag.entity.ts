import { User } from '../../user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creator' })
  creator: User;

  @Column({ length: 40, nullable: false, unique: true })
  name: string;

  @Column({ default: 0 })
  sortOrder: number;

  @ManyToMany(() => User, (user) => user.tags)
  users: User[];
}
