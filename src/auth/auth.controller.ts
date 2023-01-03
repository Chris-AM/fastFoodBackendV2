//!Nest imports
import { Controller, Post, Body } from '@nestjs/common';
//!Own imports
import { AuthService } from './auth.service';
import { LoginUserDTO, RegisterUserDTO } from './dto/';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public registerNewUser(@Body() createUserDto: RegisterUserDTO) {
    return this.authService.registerNewUser(createUserDto);
  }

  @Post('login')
  public loginUser(@Body() loginUserDto: LoginUserDTO) {
    return this.authService.loginUser(loginUserDto);
  }
}
