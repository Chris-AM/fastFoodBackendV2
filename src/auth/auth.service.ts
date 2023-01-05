//! Nest imports
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
//! Node imports
import { Repository } from 'typeorm';
import { Response } from 'express';
//! Own Imports
import { User } from '../user/entities/user.entity';
import { RegisterUserDTO } from './dto/register-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/';
import {
  comparePassToHash,
  errorHandler,
  plainToHash,
} from '../common/helpers/';

let response: Response;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public async registerNewUser(registerUserDto: RegisterUserDTO) {
    try {
      const { password, ...user } = this.authRepository.create(registerUserDto);
      const parsedUser = {
        ...user,
        password: await plainToHash(password),
      };
      await this.authRepository.save(parsedUser);
      return {
        ...parsedUser,
        token: this.getJwtToken({ id: parsedUser.id }),
      };
    } catch (error) {
      errorHandler(error);
      return response.status(501).json({
        ok: false,
        message: 'Error interno. No se pudo crear usuario',
      });
    }
  }

  public async loginUser(loginUserDto: LoginUserDTO) {
    const { password, email } = loginUserDto;
    const doesUserExist = await this.authRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });
    const check = await comparePassToHash(password, doesUserExist.password);
    if (!doesUserExist || !check) {
      throw new NotFoundException(`email o contraseña no válidos`);
    }
    try {
      const response = {
        ...doesUserExist,
        token: this.getJwtToken({ id: doesUserExist.id }),
      };
      delete response.id;
      return response;
    } catch (error) {}
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
