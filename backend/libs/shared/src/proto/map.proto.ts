import { IMessageType } from '@protobuf-ts/runtime';
import * as pb from './pb';

export const actionId2Proto = new Map<number, IMessageType<any>>([
  [1, pb.UserCreated],
  [2, pb.PostCreated],
  [3, pb.CommentCreated],
]);

export const proto2ActionId = new Map<string, number>();
actionId2Proto.forEach((v, k) => {
  proto2ActionId.set(v.typeName.split('.').pop() as string, k);
});
