//! Nest Imports
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
//! Third Party Imports
import { Repository, DataSource } from 'typeorm';
//! Own Imports
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductImage } from './entities';
import { User } from 'src/user/entities';
import { IngredientsService } from '../ingredients/ingredients.service';
import { errorHandler } from '../common/helpers/error-handler.helper';
import { PaginationDTO } from '../common/DTOs/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('Product Service ⚙️ ');
  private readonly queryRunner = this.dataSource.createQueryRunner();

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly ingredientsService: IngredientsService,
    private readonly dataSource: DataSource,
  ) {}

  //* CRUD
  public async create(createProductDto: CreateProductDto, user: User) {
    try {
      const {
        images = [],
        ingredients = [],
        ...productDetails
      } = createProductDto;
      const productIngredients = await Promise.all(
        ingredients.map((ingredient) => {
          return this.ingredientsService.findOne(ingredient);
        }),
      );
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
        ingredients: productIngredients,
        user,
      });
      await this.productRepository.save(product);
      this.logger.log('Producto Creado', product);
      return { ...product, images, ingredients };
    } catch (error) {
      this.logger.error('Producto no creado');
      errorHandler(error);
    }
    return;
  }

  public async findAll(paginationDto: PaginationDTO) {
    const { limit = 10, offset = 0 } = paginationDto;

    const allProducts = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        ingredients: true,
        images: true,
      },
    });

    const flatProducts = allProducts.map((product) => ({
      ...product,
      ingredients: product.ingredients.map((ingredient) => ingredient.name),
      images: product.images.map((image) => image.url),
    }));

    return flatProducts;
  }

  public async findOne(searchTerm: string): Promise<Product> {
    let product: Product;
    const validatedProduct = this.termValidation(searchTerm, product);
    return validatedProduct;
  }

  public async findOneAndPlainImage(searchTerm: string) {
    const product = await this.findOne(searchTerm);
    const images = product.images.map((image) => image.url);
    return { ...product, images };
  }

  public async update(
    id: string,
    updateProductDto: UpdateProductDto,
    user: User,
  ) {
    const { images, ingredients, ...toUpdate } = updateProductDto;
    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    });
    if (!product) {
      throw new NotFoundException(`No se encontró el producto ${id}`);
    }
    await this.prepareRunner();
    try {
      if (images) {
        await this.deleteProductImageRunner(id);
      }
      product.ingredients = await Promise.all(
        ingredients.map((ingredient) => {
          return this.ingredientsService.findOne(ingredient);
        }),
      );
      product.user = user;
      await this.saveProductImageRunner(product);
      await this.commitRunner();
      return this.findOneAndPlainImage(id);
    } catch (error) {
      this.rollbackAndReleaseRunner();
      errorHandler(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  //* Validations
  private async termValidation(searchTerm: string, product: Product) {
    if (isUUID(searchTerm)) {
      product = await this.productRepository.findOneBy({
        id: searchTerm,
      });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      product = await queryBuilder
        .where('LOWER(product.name) LIKE LOWER(:name) or slug=:slug', {
          name: searchTerm,
          slug: searchTerm,
        })
        .leftJoinAndSelect('product.ingredients', 'ingredients')
        .leftJoinAndSelect('product.images', 'product-images')
        .getOne();
    }
    if (!product) {
      throw new NotFoundException(`No se encontró el producto ${searchTerm}`);
    }
    return product;
  }

  //* QUERY RUNNERS
  private async prepareRunner() {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    return this.queryRunner;
  }

  private async deleteProductImageRunner(id: string) {
    //! delete * from product_images where product_id = id
    const deleteImg = await this.queryRunner.manager.delete(ProductImage, {
      product: id,
    });
    return deleteImg;
  }

  private async saveProductImageRunner(product: Product) {
    const save = await this.queryRunner.manager.save(product);
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

  //! JUST FOR DEVELOPMENT
  public async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query.delete().execute();
    } catch (error) {
      errorHandler(error);
    }
  }
}
