//* Nest Imports
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from "@nestjs/swagger";
//* Own Imports
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { PaginationDTO } from 'src/common/DTOs/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';
import { Ingredient } from './entities/ingredient.entity';

@ApiTags('Ingredients')
@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  @Auth()
  @ApiResponse({status: 201, description: 'Ingredient Created Successfully', type: Ingredient})
  create(
    @Body() createIngredientDto: CreateIngredientDto,
    @GetUser() user: User,
  ) {
    return this.ingredientsService.create(createIngredientDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDTO) {
    return this.ingredientsService.findAll(paginationDto);
  }

  @Get(':searchTerm')
  findOne(@Param('searchTerm') searchTerm: string) {
    return this.ingredientsService.findOneAndPlainImage(searchTerm);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
    @GetUser() user: User,
  ) {
    return this.ingredientsService.update(id, updateIngredientDto, user);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.ingredientsService.remove(id);
  }
}
