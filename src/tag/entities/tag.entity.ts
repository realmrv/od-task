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

  @ManyToOne(() => User, (user) => user.ownsTags)
  @JoinColumn({ name: 'creator' })
  creator: User;

  @Column({ length: 40, nullable: false, unique: true })
  name: string;

  @Column({ default: 0 })
  sortOrder: number;

  @ManyToMany(() => User, (user) => user.tags, {
    cascade: true,
  })
  users: User[];
}
