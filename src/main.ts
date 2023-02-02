import { ValidationFailedException } from './exceptions/validation-failed-exception';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.SERVER_PORT || 3000;
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: () => new ValidationFailedException(),
    }),
  );

  await app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
  });
}
bootstrap();
