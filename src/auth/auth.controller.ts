//!Nest imports
import { Controller, Post, Body } from '@nestjs/common';
//!Own imports
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerNewUser(@Body() createUserDto: CreateUserDTO) {
    return this.authService.registerNewUser(createUserDto);
  }
}
