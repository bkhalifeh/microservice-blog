import { PostMicroServiceModule } from './post-microservice.module';
import { appInit, createOnListen } from '@app/shared';

async function bootstrap() {
  const { app, logger } = await appInit(PostMicroServiceModule);
  await app.startAllMicroservices();
  await app.listen(3000, '0.0.0.0', createOnListen(logger));
}
bootstrap();
