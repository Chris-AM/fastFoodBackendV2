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

  @Get('ingredient/:fileName')
  findIngredientByName(
    @Res() response: Response,
    @Param('fileName') fileName: string,
  ) {
    const image = this.filesService.findIngredientByName(fileName, response);
    return image;
  }

  @Post('ingredient')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './static/uploads/ingredient_images',
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
}
