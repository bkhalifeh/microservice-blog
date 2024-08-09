import { appInit, createOnListen } from '@app/shared';
import { UserModule } from './modules/user/user.module';

async function bootstrap() {
  const { app, logger } = await appInit(UserModule);
  await app.startAllMicroservices();
  await app.listen(3000, '0.0.0.0', createOnListen(logger));
}
bootstrap();
