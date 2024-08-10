import { CommentMicroServiceModule } from './comment-microservice.module';
import { appInit, createOnListen } from '@app/shared';

async function bootstrap() {
  const { app, logger } = await appInit(CommentMicroServiceModule);
  await app.startAllMicroservices();
  await app.listen(3000, '0.0.0.0', createOnListen(logger));
}
bootstrap();
