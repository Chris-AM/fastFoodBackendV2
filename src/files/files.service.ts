import { NotFoundException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  findIngredientByName(imageName: string, response: Response) {
    const path = join(
      __dirname,
      '../../public/static/ingredient_images',
      imageName,
    );
    console.log(path);
    if (!existsSync(path))
      throw new NotFoundException(`Imagen no existe o no se encuentra`);
    const image = response.sendFile(path);
    return image;
  }

  findUserByName(imageName: string, response: Response) {
    const path = join(__dirname, '../../public/static/user_avatar', imageName);
    if (!existsSync(path))
      throw new NotFoundException(`Imagen no existe o no se encuentra`);
    const avatar = response.sendFile(path);
    return avatar;
  }
}
