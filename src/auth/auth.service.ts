//! Nest imports
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
//! Node imports
import { Repository } from 'typeorm';
//! Own Imports
import { User } from '../user/entities/user.entity';
import { RegisterUserDTO } from './dto/register-user.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
  ) {}

  public async registerNewUser(registerUserDto: RegisterUserDTO) {
    try {
      const user = this.authRepository.create(registerUserDto);
      await this.authRepository.save(user);
      return user;
    } catch (error) {
      let response: Response;
      return response.status(501).json({
        ok: false,
        message: 'Error interno. No se pudo crear usuario',
      });
    }
  }
}
