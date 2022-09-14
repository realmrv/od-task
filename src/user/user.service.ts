import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.save({
      ...createUserDto,
      password: bcrypt.hashSync(createUserDto.password, 10),
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

  update(uid: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto = {
        ...updateUserDto,
        password: bcrypt.hashSync(updateUserDto.password, 10),
      };
    }

    return this.usersRepository.update({ uid }, updateUserDto);
  }

  remove(uid: string) {
    return this.usersRepository.delete({ uid });
  }
}
