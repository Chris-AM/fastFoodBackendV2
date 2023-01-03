import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';

export const errorHandler = (error: any): never => {
  const logger = new Logger();
  //? just for debugging purpose
  logger.debug(error);
  if (error.code === '23505') {
    throw new BadRequestException(error.detail);
  }
  if (error.code === '22P02') {
    throw new NotFoundException('Ingrediente no encontrado');
  }
  throw new InternalServerErrorException('Unexpected error. Check Logs');
};
