import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  findIngredientByName(imageName: string, response: Response) {
    const path = join(
      __dirname,
      '../../static/uploads/ingredient_images',
      imageName,
    );
    if (!existsSync(path))
      throw new BadRequestException(`Imagen no existe o no se encuentra`);
    const image = response.sendFile(path);
    return image;
  }
}
