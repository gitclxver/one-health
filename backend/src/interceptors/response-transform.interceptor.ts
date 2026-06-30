import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface TransformedResponse<T> {
  success: true;
  message: string;
  data: T;
}

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, TransformedResponse<T> | T>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<TransformedResponse<T> | T> {
    return next.handle().pipe(
      map((data: T) => {
        // If the response is already structured (has success key), pass through as-is
        if (data && typeof data === 'object' && 'success' in (data as object)) {
          return data;
        }
        return data;
      }),
    );
  }
}
