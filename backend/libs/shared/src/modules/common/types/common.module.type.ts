import { ConfigModuleOptions } from '@nestjs/config';
import Joi from 'joi';
import { Params } from 'nestjs-pino';

export type TForRootInput = {
  pino?: Params;
  config?: ConfigModuleOptions;
  configValidation?: Joi.ObjectSchema;
};
