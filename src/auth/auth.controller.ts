//!Nest imports
import { Controller, Post, Body } from '@nestjs/common';
//!Own imports
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerNewUser(@Body() createUserDto: RegisterUserDTO) {
    return this.authService.registerNewUser(createUserDto);
  }
}
