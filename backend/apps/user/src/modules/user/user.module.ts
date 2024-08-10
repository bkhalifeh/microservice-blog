import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { PassportLocalStrategyProvider } from './providers/passport-local-strategy.provider';
import { PassportModule } from '@nestjs/passport';
import { HashModule } from '../hash/hash.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          signOptions: {
            algorithm: 'RS256',
          },
          privateKey: configService.get<string>('PRIVATE_KEY', ''),
        };
      },
    }),
    HashModule,
  ],
  controllers: [UserController],
  providers: [UserService, PassportLocalStrategyProvider],
})
export class UserModule {}
