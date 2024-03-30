import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { main } from './appMock/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  await app.listen(3000);
}
bootstrap();
