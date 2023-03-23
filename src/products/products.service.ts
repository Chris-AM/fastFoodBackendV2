//! Nest Imports
import { Injectable, Logger } from '@nestjs/common';
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
      relations:{
        ingredients: true,
        images: true,
      }
    });

    const flatProducts = allProducts.map((product)=> ({
      ...product,
      ingredients: product.ingredients.map((ingredient)=> ingredient.name),
      images: product.images.map((image)=> image.url),
    }));

    return flatProducts;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  //* Validations
  private async termValidation() {}
}
