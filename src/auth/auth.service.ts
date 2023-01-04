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
import { JwtPayload } from './interfaces/jwt-payload.interface';
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
        token: this.getJwtToken({ email: parsedUser.email }),
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
      select: { email: true, password: true },
    });
    const check = await comparePassToHash(password, doesUserExist.password);
    if (!doesUserExist || !check) {
      throw new NotFoundException(`email o contraseña no válidos`);
    }
    try {
      return {
        ...doesUserExist,
        token: this.getJwtToken({ email: doesUserExist.email }),
      };
    } catch (error) {}
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
