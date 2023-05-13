import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : new InternalServerErrorException('Internal Server Error');
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception.message;

    this.logger.error(
      '***ERROR*** \n ' +
        'Status: ' +
        status +
        '\n' +
        'Message: ' +
        message.message,
    );

    response.status(status).json({
      time: new Date().toISOString(),
      path: request.url,
      method: request.method,
      status: status,
      error: message,
    });
  }
}
