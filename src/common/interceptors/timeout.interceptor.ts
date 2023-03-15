import { CallHandler, ExecutionContext, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, timeout } from 'rxjs';

export class TimeoutInterceptor implements NestInterceptor {
  private logger = new Logger();
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    this.logger.log('Timeout Interceptor context: ' + context);
    return next.handle().pipe(timeout(5000));
  }
}
