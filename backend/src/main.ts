import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  
  // 1. Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // 2. Seguridad
  app.use(helmet());

  // 3. CORS
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  // 4. CONFIGURACIÓN DE SWAGGER
  const config = new DocumentBuilder()
    .setTitle('Clínica ACME')
    .setDescription('API para gestión de turnos de clínica')
    .setVersion('1.0')
    .addBearerAuth() // Para autenticación JWT
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, document); 
  // 5. Iniciar servidor
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Servidor: http://localhost:${port}`);
  console.log(`Swagger: http://localhost:${port}/api/v1`);
}
await bootstrap();
