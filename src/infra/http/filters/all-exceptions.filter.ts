import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { DomainException } from 'src/core/exceptions/domain-exception';
import { ConflictException } from 'src/core/exceptions/conflict.exception';
import { ResourceNotFoundException } from 'src/core/exceptions/resource-not-found.exception';

interface HttpExceptionResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let details: string | null = null;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'object' && response !== null) {
        const responseObj = response as HttpExceptionResponse;
        message = responseObj.message;
        details = responseObj.error || null;
      } else {
        message = String(response);
      }
    } else if (exception instanceof DomainException) {
      if (exception instanceof ConflictException) {
        httpStatus = HttpStatus.CONFLICT;
      } else if (exception instanceof ResourceNotFoundException) {
        httpStatus = HttpStatus.NOT_FOUND;
      } else {
        httpStatus = HttpStatus.BAD_REQUEST;
      }
      message = exception.message;
    } else {
      console.error('Unhandled Exception:', exception);
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()) as string,
      message: message,
      details: details,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
