import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<FastifyReply>();
    const exceptionResponse: any = exception.getResponse();
    const statusCode = exception.getStatus();
    res.status(statusCode);
    if (exceptionResponse.path) {
      const property = exceptionResponse.path.replace('$input.', '');
      res.send({
        message: `${property} must be an ${property}`,
        error: 'Bad Request',
        statusCode,
      });
    } else {
      res.send(exceptionResponse);
    }
  }
}
