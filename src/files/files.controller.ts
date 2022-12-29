//! Nest packages
import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
//! Node Packages
import { diskStorage } from 'multer';
//! Own Packages
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers/';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

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
    return file;
  }
}
