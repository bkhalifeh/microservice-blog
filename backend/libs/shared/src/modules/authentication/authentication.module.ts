import { DynamicModule, Global, Module } from '@nestjs/common';
import { AuthenticationOption } from './enums/authentication.option.enum';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          signOptions: {
            algorithm: 'RS256',
          },
          verifyOptions: {
            algorithms: ['RS256'],
          },
          publicKey: configService.get<string>('PUBLIC_KEY', ''),
          privateKey: configService.get<string>('PRIVATE_KEY', ''),
        };
      },
    }),
  ],
})
export class AuthenticationModule {}
