//! Nest packages
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
//! Node Packages
import { diskStorage } from 'multer';
import { Response } from 'express';
//! Own Packages
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers/';
import { ConfigService } from '@nestjs/config';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  //! INGREDIENTS
  @Post('ingredient')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './public/static/ingredient_images',
        filename: fileNamer,
      }),
    }),
  )
  uploadIngredientImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Archivo no soportado');
    }
    const baseUrl = this.configService.get('HOST_API');
    if (!baseUrl) throw new BadRequestException('Missing baseurl');
    const secureUrl = `${baseUrl}/files/ingredient/${file.filename}`;
    return { secureUrl };
  }

  @Get('ingredient/:fileName')
  findIngredientByName(
    @Res() response: Response,
    @Param('fileName') fileName: string,
  ) {
    const image = this.filesService.findIngredientByName(fileName, response);
    return image;
  }

  //! PRODUCTS
  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './public/static/product_images',
        filename: fileNamer,
      }),
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Archivo no soportado');
    }
    const baseUrl = this.configService.get('HOST_API');
    if (!baseUrl) throw new BadRequestException('Missing baseurl');
    const secureUrl = `${baseUrl}/files/product/${file.filename}`;
    return { secureUrl };
  }

  @Get('product/:fileName')
  findProductByName(
    @Res() response: Response,
    @Param('fileName') fileName: string,
  ) {
    const image = this.filesService.findProductByName(fileName, response);
    return image;
  }
  
  //! USERS
  @Post('user')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './public/static/user_avatar',
        filename: fileNamer,
      }),
    }),
  )
  uploadUserAvatar(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Archivo no soportado');
    }
    const baseUrl = this.configService.get('HOST_API');
    if (!baseUrl) throw new BadRequestException('Missing baseurl');
    const secureUrl = `${baseUrl}/files/user/${file.filename}`;
    return { secureUrl };
  }

  @Get('user/:fileName')
  findUserAvatarByName(
    @Res() response: Response,
    @Param('fileName') fileName: string,
  ) {
    const avatar = this.filesService.findUserByName(fileName, response);
    return avatar;
  }
}
