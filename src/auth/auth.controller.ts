//!Nest imports
import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
//!Own imports
import { AuthService } from './auth.service';
import { LoginUserDTO, RegisterUserDTO } from './dto/';
import { User } from 'src/user/entities/user.entity';
import { Auth, GetUser } from './decorators';

@ApiTags('Auth')
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

  @Get('status')
  @Auth()
  public checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }
}
