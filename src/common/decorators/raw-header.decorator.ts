import {
    ExecutionContext,
    InternalServerErrorException,
    createParamDecorator,
  } from '@nestjs/common';
  
  export const RawHeaderDecorator = createParamDecorator(
    (data: string, context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      const rawHeader = request.rawHeaders;
      if (!rawHeader) {
        throw new InternalServerErrorException(
          'Usuario no encontrado (por Request)',
        );
      }
      const dataOrUser = !data ? rawHeader : rawHeader[data];
      return dataOrUser;
    },
  );