import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

/**
 * Global exception filter that handles all unhandled exceptions in the NestJS application.
 * Implements the ExceptionFilter interface to provide consistent error responses across the application.
 *
 * Features:
 * - Catches both HTTP and non-HTTP exceptions
 * - Provides standardized error response format
 * - Includes timestamp and request path in the response
 * - Logs stack traces for HTTP exceptions
 *
 * @example
 * // Register the filter globally in your app.module.ts
 * app.useGlobalFilters(new HttExceptionFilter(httpAdapter));
 *
 * Response Format:
 * {
 *   statusCode: number,
 *   timestamp: string,
 *   path: string,
 *   message: string
 * }
 */
@Catch()
export class HttExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR
    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: exception instanceof HttpException
        ? exception.message
        : 'Internal server error',
    }

    if(exception instanceof HttpException){
      console.error('Stack trace: ', exception.stack.split('\n').slice(1).join('\n'))
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
};
