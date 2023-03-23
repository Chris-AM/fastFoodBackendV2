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

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
  ) {}

  public async registerNewUser(registerUserDto: RegisterUserDTO) {
    try {
      const { password, ...user } = registerUserDto;
      const parsedUser = {
        ...user,
        password: await plainToHash(password),
      }
      const doesUserExist = await this.authRepository.findOne({
        where: { email: parsedUser.email },
      });
      if (doesUserExist) {
        throw new NotFoundException(`El usuario ya existe`);
      }

      const newUser = await this.authRepository.save(parsedUser);
      const payload = { id: newUser.id };
      const token = this.getJwtToken(payload);
      const data = {
        user: newUser,
        token,
      };
      return data;
    } catch (error) {
      errorHandler(error);
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
    } catch (error) {
      console.log('error ===> ', error);
      errorHandler(error);
    }
  }

  public async checkAuthStatus(user: User){
    const  response = {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
    return  response;
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
