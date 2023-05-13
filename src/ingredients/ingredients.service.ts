//! Nest Imports
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
//! Third Party Imports
import { validate as isUUID } from 'uuid';
//! Own Imports
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient, IngredientImage } from './entities/';
import { PaginationDTO } from '../common/DTOs/pagination.dto';
import { errorHandler } from 'src/common/helpers/error-handler.helper';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class IngredientsService {
  private readonly logger = new Logger('Ingredient Service ⚙️ ');
  private readonly queryRunner = this.dataSource.createQueryRunner();

  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
    @InjectRepository(IngredientImage)
    private readonly ingredientImageRepository: Repository<IngredientImage>,
    private readonly dataSource: DataSource,
  ) {}

  //* CRUD
  public async findOne(searchTerm: string): Promise<Ingredient> {
    let ingredient: Ingredient;
    const validatedIngredient = await this.termValidation(
      searchTerm,
      ingredient,
    );
    return validatedIngredient;
  }

  public async create(createIngredientDto: CreateIngredientDto, user: User) {
    try {
      const { images = [], ...ingredientDetails } = createIngredientDto;
      const ingredient = this.ingredientRepository.create({
        ...ingredientDetails,
        images: images.map((image) =>
          this.ingredientImageRepository.create({ url: image }),
        ),
        user,
      });
      await this.ingredientRepository.save(ingredient);
      return { ...ingredient, images };
    } catch (error) {
      errorHandler(error);
    }
    return;
  }

  public async findAll(paginationDto: PaginationDTO) {
    const { limit = 10, offset = 0 } = paginationDto;

    const allIngredients = await this.ingredientRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    });
    const flatIngredient = allIngredients.map((ingredient) => ({
      ...ingredient,
      images: ingredient.images.map((ingredientImage) => ingredientImage.url),
    }));
    return flatIngredient;
  }

  public async findOneAndPlainImage(searchTerm: string) {
    const { images, ...ingredient } = await this.findOne(searchTerm);
    const imgUrl = images.map((image) => image.url);
    return { ...ingredient, imgUrl };
  }

  public async update(
    id: string,
    updateIngredientDto: UpdateIngredientDto,
    user: User,
  ) {
    const { images, ...toUpdate } = updateIngredientDto;
    const ingredient = await this.ingredientRepository.preload({
      id,
      ...toUpdate,
    });
    if (!ingredient) {
      throw new NotFoundException(
        `ingrediente ${id} no existe o no se encuentra`,
      );
    }
    await this.prepareRunner();
    try {
      if (images) {
        await this.deleteIngredientImageRunner(id);
        ingredient.images = images.map((image) =>
          this.ingredientImageRepository.create({ url: image }),
        );
      }
      ingredient.user = user;
      await this.saveIngredientImageRunner(ingredient);
      await this.commitRunner();
      return this.findOneAndPlainImage(id);
    } catch (error) {
      console.debug('in catch');
      this.rollbackAndReleaseRunner();
      errorHandler(error);
    }
  }

  public async remove(id: string) {
    const doesIngredientExists = await this.findOne(id);
    if (doesIngredientExists) {
      await this.ingredientRepository.remove(doesIngredientExists);
    }
    return `Ingrediente ${doesIngredientExists.name} borrado`;
  }

  //* VALIDATIONS

  private async termValidation(searchTerm: string, ingredient: Ingredient) {
    if (isUUID(searchTerm)) {
      ingredient = await this.ingredientRepository.findOneBy({
        id: searchTerm,
      });
    } else {
      const queryBuilder =
        this.ingredientRepository.createQueryBuilder('ingredient');
      ingredient = await queryBuilder
        .where('LOWER(ingredient.name) LIKE LOWER(:name) or slug=:slug', {
          name: searchTerm,
          slug: searchTerm,
        })
        .leftJoinAndSelect('ingredient.images', 'ingredients-images')
        .getOne();
    }
    if (!ingredient) {
      throw new NotFoundException(
        `ingrediente ${searchTerm} no existe o no se encuentra`,
      );
    }
    return ingredient;
  }

  //* QUERY RUNNERS
  private async prepareRunner() {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    return this.queryRunner;
  }
  private async deleteIngredientImageRunner(id: string) {
    //! delete * from IngredientImage where id = :id
    const deleteImg = await this.queryRunner.manager.delete(IngredientImage, {
      ingredient: { id },
    });
    return deleteImg;
  }

  private async saveIngredientImageRunner(ingredient: Ingredient) {
    const save = await this.queryRunner.manager.save(ingredient);
    return save;
  }

  private async commitRunner() {
    await this.queryRunner.commitTransaction();
    return this.queryRunner;
  }

  private async rollbackAndReleaseRunner() {
    await this.queryRunner.rollbackTransaction();
    await this.queryRunner.release();
    return this.queryRunner;
  }

  //! JUST FOR DEV PURPOSE
  async deleteAllIngredients() {
    const query = this.ingredientRepository.createQueryBuilder('ingredient');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      errorHandler(error);
    }
  }
}
