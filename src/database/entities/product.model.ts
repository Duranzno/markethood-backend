import 'reflect-metadata';
import { prop } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';

import { ProductStatus } from './common.model';
/** This is the minimum unit of logic that will exist in the Database.
 *  Products can be owned by Users.
 *
 */
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
