//! Nest imports
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
//! Node imports
import { Repository } from 'typeorm';
//! Own Imports
import { User } from '../user/entities/user.entity';
import { RegisterUserDTO } from './dto/register-user.dto';
import { Response } from 'express';
import { errorHandler } from '../common/helpers/error-handler.helper';
import { plainToHash } from 'src/common/helpers/bCrypt.helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
  ) {}

  public async registerNewUser(registerUserDto: RegisterUserDTO) {
    try {
      const { password, ...user } = this.authRepository.create(registerUserDto);
      const parsedUser = {
        ...user,
        password: await plainToHash(password),
      };
      await this.authRepository.save(parsedUser);
      return parsedUser;
    } catch (error) {
      let response: Response;
      errorHandler(error);
      return response.status(501).json({
        ok: false,
        message: 'Error interno. No se pudo crear usuario',
      });
    }
  }
}
