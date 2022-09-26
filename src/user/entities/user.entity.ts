import { Exclude } from 'class-transformer';
import { Tag } from '../../tag/entities/tag.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

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

  @ManyToMany(() => Tag, (tag) => tag.users, {
    cascade: true,
  })
  @JoinTable({
    name: 'users_tags', // table name for the junction table of this relation
    joinColumn: {
      name: 'userUid',
      referencedColumnName: 'uid',
    },
    inverseJoinColumn: {
      name: 'tagId',
      referencedColumnName: 'id',
    },
  })
  tags: Tag[];
}
