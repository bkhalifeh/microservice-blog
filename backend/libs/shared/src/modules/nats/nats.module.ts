import { CLIENT_NATS } from '@app/shared/common';
import { ProtoDeserializer, ProtoSerializer } from '@app/shared/proto';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, NatsOptions, Transport } from '@nestjs/microservices';

export const getNatsOption = (configService: ConfigService): NatsOptions => {
  return {
    transport: Transport.NATS,
    options: {
      servers: [configService.get<string>('NATS_SERVER', 'nats://nats:4222')],
      serializer: new ProtoSerializer(),
      deserializer: new ProtoDeserializer(),
    },
  };
};

@Module({
  imports: [
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: CLIENT_NATS,
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            return getNatsOption(configService);
          },
        },
      ],
    }),
  ],
})
export class NatsModule {}
