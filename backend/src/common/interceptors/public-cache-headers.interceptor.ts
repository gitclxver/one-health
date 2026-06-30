import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Response } from 'express';

/** CDN-friendly cache headers for public read endpoints. */
export const PUBLIC_CACHE_HEADER =
  'public, max-age=60, s-maxage=600, stale-while-revalidate=86400';

@Injectable()
export class PublicCacheHeadersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      tap(() => {
        if (!response.headersSent && !response.getHeader('Cache-Control')) {
          response.setHeader('Cache-Control', PUBLIC_CACHE_HEADER);
        }
      }),
    );
  }
}
