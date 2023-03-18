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
      const flatUser = {
        ...newUser,
        avatar: newUser.avatar?.url || null,
      };
      return flatUser;
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
        },
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
      const { avatar, ...user } = await this.findOne(searchTerm);
      const flatUser = {
        ...user,
        avatar: avatar?.url || null,
      };
      return flatUser;
    } catch (error) {
      console.log('error ===> ', error);
      errorHandler(error);
    }
  }

  public async findOne(searchTerm: string): Promise<User> {
    let user: User;
    const validatedUser = await this.termValidation(searchTerm, user);
    return validatedUser;
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    const { avatar, password, ...toUpdateRest } = updateUserDto;
    const user = await this.userRepository.preload({ id, ...toUpdateRest });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    await this.prepareRunner();
    try {
      if (avatar) {
        await this.deleteUserAvatarRunner(id);
        user.avatar = this.userAvatarRepository.create({ url: avatar });
      }
      await this.saveUserAvatarRunner(user);
      await this.commitRunner();
      return this.findOneAndPlainAvatar(id);
    } catch (error) {
      await this.rollbackAndReleaseRunner();
      errorHandler(error);
    }
  }

  public async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    await this.userRepository.remove(user);
    return `Usuario ${user.fullName} eliminado`;
  }

  //* Validations
  private async termValidation(searchTerm: string, user: User) {
    console.log('searchTerm ===> ', searchTerm);
    if (isUUID(searchTerm)) {
      user = await this.userRepository.findOneBy({ id: searchTerm });
    } else {
      const queryBuilder = this.userRepository.createQueryBuilder('user');
      user = await queryBuilder
        .where('LOWER(user.fullName) LIKE LOWER(:fullName) or email=:email', {
          fullName: searchTerm,
          email: searchTerm,
        })
        .leftJoinAndSelect('user.avatar', 'avatar')
        .getOne();
    }
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  //* Query runners
  private async prepareRunner() {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    return this.queryRunner;
  }

  private async deleteUserAvatarRunner(id: string) {
    await this.queryRunner.manager.delete(UserAvatar, { id });
  }

  private async saveUserAvatarRunner(user: User) {
    const save = await this.queryRunner.manager.save(user);
  }

  private async commitRunner() {
    await this.queryRunner.commitTransaction();
    return this.queryRunner;
  }

  private async rollbackAndReleaseRunner() {
    await this.queryRunner.rollbackTransaction();
    await this.queryRunner.release();
    return this.queryRunner;
  }

  //! JUST FOR DEV PURPOSE
  async deleteAllUsers() {
    const query = this.userRepository.createQueryBuilder('user');
    const queryAvatar = this.userAvatarRepository.createQueryBuilder('avatar');
    try {
      const deleteAvatar = await queryAvatar.delete().where({}).execute();
      const deleteUsers = await query.delete().where({}).execute();
      return { deleteAvatar, deleteUsers };

    } catch (error) {
      errorHandler(error);
    }
  }
}
