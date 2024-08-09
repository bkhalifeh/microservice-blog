import { DynamicModule, Module } from '@nestjs/common';
import { DrizzleService } from './services/drizzle.service';

@Module({})
export class DrizzleModule {
  public static forRoot<T extends Record<string, unknown>>(
    name: string,
    schema: T,
  ): DynamicModule {
    return {
      global: true,
      module: DrizzleModule,
      providers: [
        {
          useValue: name.toUpperCase(),
          provide: 'DB_NAME',
        },
        {
          useValue: schema,
          provide: 'SCHEMA',
        },
        DrizzleService,
      ],
      exports: [DrizzleService],
    };
  }
}
