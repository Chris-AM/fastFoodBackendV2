import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserAvatar } from './entities';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAvatar]), PassportModule.register({ defaultStrategy: 'jwt' }),] ,
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
