//! Nest Imports
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
//! Node Imports
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
//! Own Imports
import { User } from 'src/user/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    public readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new UnauthorizedException('Token Inválido');
    }
    if (!user.isActive) {
      throw new UnauthorizedException(
        'Usuario inactivo. Hablar con administrado',
      );
    }
    return user;
  }
}
