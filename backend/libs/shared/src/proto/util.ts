import {
  ConsumerDeserializer,
  IncomingEvent,
  OutgoingEvent,
  ProducerSerializer,
} from '@nestjs/microservices';
import { IMessageType } from '@protobuf-ts/runtime';
import { actionId2Proto, proto2ActionId } from './map.proto';

export class ProtoSerializer implements ProducerSerializer {
  serialize(value: OutgoingEvent, options?: Record<string, any>) {
    const { data, pattern } = value;
    const aid = proto2ActionId.get(pattern) as number;
    const protoType = actionId2Proto.get(aid) as IMessageType<any>;
    const payload = protoType.toBinary(data);
    const baid = Buffer.alloc(2);
    baid.writeUInt16LE(aid);
    return { pattern, data: Buffer.concat([baid, payload]) };
  }
}

export class ProtoDeserializer implements ConsumerDeserializer {
  deserialize(value: any, options?: Record<string, any>): IncomingEvent {
    const buf = Buffer.from(value);
    const actionId = buf.readUInt16LE();
    const payload = buf.subarray(2, buf.length);
    const protoType = actionId2Proto.get(actionId) as IMessageType<any>;
    const decodedPayload = protoType.fromBinary(payload);
    return { pattern: options?.channel, data: decodedPayload };
  }
}
