import 'reflect-metadata';
import { prop } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { ArgsType, Field, ObjectType } from 'type-graphql';

import { ProductStatus } from './common.model';
/** This is the minimum unit of logic that will exist in the Database.
 *  Products can be owned by Users.
 *
 */
@ArgsType()
@ObjectType({ description: ' Product' })
export class ProductClass {
  readonly _id?: ObjectId;

  @Field(() => String)
  @prop({
    required: true,
  })
  public title!: string;

  @Field(() => String)
  @prop({
    enum: Object.values(ProductStatus),
    default: ProductStatus.on_going,
  })
  status?: string;

  @Field(() => [Number])
  @prop({ type: () => [Number] })
  public price?: number[];
}
