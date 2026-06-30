import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters';
import { ResponseTransformInterceptor } from './interceptors';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') ?? 3001;
  const nodeEnv = configService.get<string>('app.env') ?? 'development';

  // Security
  app.use(helmet());
  app.use(cookieParser());

  // CORS — tighten origin in production
  app.enableCors({
    origin: nodeEnv === 'production' ? process.env.FRONTEND_URL : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // Versioned API prefix
  app.setGlobalPrefix('api/v1');

  // Global validation — strip unknown fields, transform types
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global guards (JWT applied everywhere; use @Public() to bypass)
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global response interceptor
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  await app.listen(port);
  console.log(`Application running on port ${port} [${nodeEnv}]`);
}

bootstrap();
