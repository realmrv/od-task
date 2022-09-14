import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2';

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
}
