import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { LoggerModule, Params } from 'nestjs-pino';
import { TForRootInput } from './types/common.module.type';

@Module({})
export class CommonModule {
  public static forRoot(args: TForRootInput): DynamicModule {
    const pinoOptions: Params = args.pino
      ? args.pino
      : {
          pinoHttp: {
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
              },
            },
            serializers: {
              req: (value) => {
                return `${value.id} - ${value.method} - ${value.url}`;
              },
              res: (value) => {
                return `${value.statusCode}`;
              },
              responseTime: () => {},
            },
          },
        };
    const configOptions: ConfigModuleOptions = args.config
      ? args.config
      : {
          isGlobal: true,
          ignoreEnvFile: true,
          validationSchema: args.configValidation,
        };
    return {
      module: CommonModule,
      imports: [
        LoggerModule.forRoot(pinoOptions),
        ConfigModule.forRoot(configOptions),
      ],
    };
  }
}
