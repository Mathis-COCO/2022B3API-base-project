import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/user.dto';
import { User } from '../entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  
  create(body: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(body);
    return this.usersRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find()
  }

  findUser(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email: email } });
  }

  findId(id: string): Promise<User> {
    return this.usersRepository.findOne({ where: { id: id } });
  }
}
