import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2';
import { Tag } from '../tag/entities/tag.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.usersRepository.save({
      ...createUserDto,
      password: await this.hashPassword(createUserDto.password),
    });
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(uid: string) {
    return this.usersRepository.findOneBy({ uid });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async findOwnsTags(uid: string): Promise<Tag[]> {
    const user = await this.usersRepository.findOne({
      select: { ownsTags: true },
      where: { uid },
      relations: ['ownsTags'],
    });
    return user.ownsTags;
  }

  async update(uid: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto = {
        ...updateUserDto,
        password: await this.hashPassword(updateUserDto.password),
      };
    }

    return this.usersRepository.update({ uid }, updateUserDto);
  }

  remove(uid: string) {
    return this.usersRepository.delete({ uid });
  }

  protected async hashPassword(password: string) {
    return argon2.hash(password);
  }

  async findAssociatedTags(uid: string): Promise<Tag[]> {
    const user = await this.usersRepository.findOne({
      select: { tags: true },
      where: { uid },
      relations: ['tags'],
    });

    return user.tags;
  }

  async associateTags(uid: string, tags: number[]) {
    const user = await this.usersRepository.findOne({
      select: { tags: true },
      where: { uid },
      relations: ['tags'],
    });

    user.tags = user.tags.concat(
      tags.map((value) => ({
        id: value,
      })) as Tag[],
    );
    return this.usersRepository.save(user);
  }

  async dissociateTag(uid: string, tagId: number) {
    const user = await this.usersRepository.findOne({
      select: { tags: true },
      where: { uid },
      relations: ['tags'],
    });
    user.tags = user.tags.filter((tag) => {
      return tag.id !== tagId;
    });
    return this.usersRepository.save(user);
  }
}
