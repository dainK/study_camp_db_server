import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import * as Sentry from '@sentry/node';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RavenInterceptor } from 'nest-raven';
// import express from 'express'; 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [process.env.CLIENT, process.env.SOCKET, process.env.DB],
    credentials: true, // 쿠키 허용
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더
  });

  const configService = app.get(ConfigService);

  Sentry.init({
    dsn: configService.get<string>('SENTRY_DSN'), // Sentry DSN으로 교체
  });

  app.useGlobalInterceptors(new RavenInterceptor());

  const port = configService.get<number>('PORT');
  // 인증 키 파일 경로 설정
  const keyPath = path.join(__dirname, '..', 'key.pem');
  const certPath = path.join(__dirname, '..', 'cert.pem');

  // HTTPS 설정
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    const httpsOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
    await app.init();
    https
      .createServer(httpsOptions, app.getHttpAdapter().getInstance())
      .listen(port);
    console.log(`HTTPS server running on port ${port}`);
  } else {
    // HTTP로 실행
    await app.listen(port);
    console.log(`HTTP server running on port ${port}`);
  }
}
bootstrap();
