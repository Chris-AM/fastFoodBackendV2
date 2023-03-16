//! NestJS Modules
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
//! Node imports
import { Repository } from 'typeorm';
//! Own Imports
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { errorHandler, plainToHash } from 'src/common/helpers';
import { User } from './entities/user.entity';
import { PaginationDTO } from 'src/common/DTOs/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  public async createUserInPortal(createUserDto: CreateUserDto) {
    try {
      const { password, ...user } = createUserDto;
      const parsedUser = {
        ...user,
        password: await plainToHash(password),
      };
      const doesUserExist = await this.userRepository.findOne({
        where: { email: parsedUser.email },
      });
      if (doesUserExist) {
        throw new NotFoundException(`El usuario ya existe`);
      }
      const newUser = await this.userRepository.save(parsedUser);
      return newUser;
    } catch (error) {
      errorHandler(error);
    }
  }

  public async findAll(paginationDto: PaginationDTO) {
    console.log('debug in get all users service');
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const allUsers = await this.userRepository.find({
        take: limit,
        skip: offset,
      });
      return allUsers;
    } catch (error) {
      errorHandler(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
