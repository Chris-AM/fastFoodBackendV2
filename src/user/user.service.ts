//! NestJS Modules
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
//! Node imports
import { DataSource, Repository } from 'typeorm';
//! Own Imports
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { errorHandler, plainToHash } from 'src/common/helpers';
import { User, UserAvatar } from './entities/';
import { PaginationDTO } from 'src/common/DTOs/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class UserService {
  private readonly logger = new Logger('User Service ⚙️ ');
  private readonly queryRunner = this.dataSource.createQueryRunner();
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserAvatar)
    private readonly userAvatarRepository: Repository<UserAvatar>,
    private readonly dataSource: DataSource,
  ) {}

  public async createUserInPortal(createUserDto: CreateUserDto) {
    try {
      const { avatar, password, ...user } = createUserDto;
      const parsedUser = this.userRepository.create({
        ...user,
        avatar: this.userAvatarRepository.create({ url: avatar }),
        password: await plainToHash(password),
      });
      const newUser = await this.userRepository.save(parsedUser);
      return newUser;
    } catch (error) {
      errorHandler(error);
    }
  }

  public async findAll(paginationDto: PaginationDTO) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const allUsers = await this.userRepository.find({
        take: limit,
        skip: offset,
        relations: {
          avatar: true,
        }
      });
      const flatUser = allUsers.map((user) => ({
        ...user,
        avatar: user.avatar?.url || null,
      }));
      console.log(allUsers);
      return flatUser;
    } catch (error) {
      console.log('error ===> ', error);
      errorHandler(error);
    }
  }

  public async findOneAndPlainAvatar(searchTerm: string) {
    try {
      const { avatar , ...user } =  await this.findOne(searchTerm);
    } catch (error) {
      errorHandler(error);      
    }
  }

  public async findOne(searchTerm: string): Promise<User> {
    let user: User;
    const validatedUser = await this.termValidation(searchTerm, user);
    return validatedUser;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  //* Validations
  private async termValidation(searchTerm: string, user: User) {
    if(isUUID(searchTerm)){
      user = await this.userRepository.findOneBy({id: searchTerm});
    } else {
      const queryBuilder = this.userRepository.createQueryBuilder('user');
      user = await queryBuilder
        .where('user.email = :email', { email: searchTerm })
        .leftJoinAndSelect('user.avatar', 'avatar')
        .getOne();
    }
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }
}
