import { appInit, createOnListen } from '@app/shared';
import { UserMicroServiceModule } from './user-microservice.module';

async function bootstrap() {
  const { app, logger } = await appInit(UserMicroServiceModule);
  await app.startAllMicroservices();
  await app.listen(3000, '0.0.0.0', createOnListen(logger));
}
bootstrap();
