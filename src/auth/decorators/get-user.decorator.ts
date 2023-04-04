import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('user Decorator', user);
    if (!user) {
      throw new InternalServerErrorException(
        'Usuario no encontrado (por Request)',
      );
    }
    const dataOrUser = !data ? user : user[data];
    return dataOrUser;
  },
);
