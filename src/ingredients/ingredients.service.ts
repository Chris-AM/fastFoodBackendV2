//* Nest Imports
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
//* Own Imports
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';
import { PaginationDTO } from '../common/DTOs/pagination.dto';

@Injectable()
export class IngredientsService {
  private readonly logger = new Logger('Ingredient Service ⚙️ ');
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}
  async create(createIngredientDto: CreateIngredientDto) {
    try {
      const ingredient = this.ingredientRepository.create(createIngredientDto);
      await this.ingredientRepository.save(ingredient);
      return ingredient;
    } catch (error) {
      this.errorHandler(error);
    }
    return;
  }

  async findAll(paginationDto:PaginationDTO) {
    const { limit = 10, offset = 0 } = paginationDto;
    console.log('🚀 pagination', limit, offset);
    const allIngredients = await this.ingredientRepository.find({
      take: limit,
      skip: offset,
    });
    return allIngredients;
  }

  async findOne(id: string): Promise<Ingredient> {
    try {
      const doesIngredientExists = await this.ingredientRepository.findOne({
        where: { id },
      });
      if (!doesIngredientExists)
        throw new NotFoundException('Ingrediente no encontrado');
      return doesIngredientExists;
    } catch (error) {
      this.errorHandler(error);
    }
  }

  update(id: string, updateIngredientDto: UpdateIngredientDto) {
    return `This action updates a #${id} ingredient`;
  }

  async remove(id: string) {
    const doesIngredientExists = await this.findOne(id);
    if (doesIngredientExists) {
      await this.ingredientRepository.remove(doesIngredientExists);
    }
    return `Ingrediente ${doesIngredientExists.name} borrado`;
  }

  private errorHandler(error: any) {
    // console.log('general errors =>', error);
    this.logger.error(error);
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    if (error.code === '22P02' || error.response.statusCode === 404) {
      throw new NotFoundException('Ingrediente no encontrado');
    }
    throw new InternalServerErrorException('Unexpected error. Check Logs');
  }
}
