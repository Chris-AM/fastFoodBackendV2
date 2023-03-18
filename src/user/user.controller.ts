import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDTO } from '../common/DTOs/pagination.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth(ValidRoles.ADMIN, ValidRoles.MANAGER, ValidRoles.DEV)
  @Post('create-user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUserInPortal(createUserDto);
  }

  @Auth(ValidRoles.ADMIN, ValidRoles.MANAGER, ValidRoles.DEV)
  @Get()
  findAll(@Query() paginationDto: PaginationDTO) {
    return this.userService.findAll(paginationDto);
  }

  @Auth(ValidRoles.ADMIN, ValidRoles.MANAGER, ValidRoles.DEV)
  @Get(':searchTerm')
  findOne(@Param('searchTerm') searchTerm: string) {
    return this.userService.findOneAndPlainAvatar(searchTerm);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
