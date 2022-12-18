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
//* Third Party Imports
import { validate as isUUID } from 'uuid';
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

  //* CRUD
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

  async findAll(paginationDto: PaginationDTO) {
    const { limit = 10, offset = 0 } = paginationDto;
    console.log('🚀 pagination', limit, offset);
    const allIngredients = await this.ingredientRepository.find({
      take: limit,
      skip: offset,
    });
    return allIngredients;
  }

  async findOne(searchTerm: string): Promise<Ingredient> {
    let ingredient: Ingredient;
    const validatedIngredient = await this.termValidation(
      searchTerm,
      ingredient,
    );
    return validatedIngredient;
  }

  async update(id: string, updateIngredientDto: UpdateIngredientDto) {
    try {
      const ingredient = await this.ingredientRepository.preload({
        id,
        ...updateIngredientDto,
      });
      if (!ingredient) {
        throw new NotFoundException(
          `Producto ${id} no existe o no se encuentra`,
        );
      }
      const updatedIngredient = await this.ingredientRepository.save(
        ingredient,
      );
      return updatedIngredient;
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async remove(id: string) {
    const doesIngredientExists = await this.findOne(id);
    if (doesIngredientExists) {
      await this.ingredientRepository.remove(doesIngredientExists);
    }
    return `Ingrediente ${doesIngredientExists.name} borrado`;
  }

  //* VALIDATIONS

  private async termValidation(searchTerm: string, ingredient: Ingredient) {
    if (isUUID(searchTerm)) {
      ingredient = await this.ingredientRepository.findOne({
        where: { id: searchTerm },
      });
    } else {
      const queryBuilder =
        this.ingredientRepository.createQueryBuilder('ingredient');
      ingredient = await queryBuilder
        .where('LOWER(ingredient.name) LIKE LOWER(:name) or slug=:slug', {
          name: searchTerm,
          slug: searchTerm,
        })
        .getOne();
    }
    if (!ingredient) {
      throw new NotFoundException(
        `Producto ${searchTerm} no existe o no se encuentra`,
      );
    }
    return ingredient;
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
