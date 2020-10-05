import 'reflect-metadata';
import { prop } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';

import { ProductStatus } from './common.model';

export class ProductClass {
  readonly _id?: ObjectId;

  @prop({
    required: true,
  })
  public title!: string;

  @prop({
    enum: Object.values(ProductStatus),
  })
  status?: string;

  @prop({ type: () => [Number] })
  public price?: number[];
}
