//! Nest imports
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
//! Node imports
import { Repository } from 'typeorm';
//! Own Imports
import { User } from './entities/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
  ) {}

  public async registerNewUser(createUserDto: CreateUserDTO) {
    console.log('🚀 in service');
    try {
      console.log('🚀 in try');
      const user = this.authRepository.create(createUserDto);
      await this.authRepository.save(user);
      return user;
    } catch (error) {
      console.log('🚀 in catch', error);
      let response: Response;
      return response.status(501).json({
        ok: false,
        message: 'Error interno. No se pudo crear usuario',
      });
    }
  }
}
