import 'reflect-metadata';
import { getModelForClass, pre, prop } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import slug from 'slug';
import { ArgsType, Field, ObjectType } from 'type-graphql';

import { ProductStatus } from './common.model';

/**
 * The Slug generator will generate a slug out of title and id
 */
export const genSlug = (title?: string, id?: ObjectId) =>
  slug(`${title ?? ''}-${id ?? ''}`);

/** This is the minimum unit of logic that will exist in the Database.
 *  Implementing Decorators it will be used as:
 *  * A type-graphql Object
 *  * A typegoose class to create the mongoose model
 *  * A type-graphql Argument (when creating or updating)
 *  Products can be owned by Users.
 *  ---
 *  It will create it's own slug using its title and the id
 */
@ArgsType()
@ObjectType({ description: ' Product' })
@pre<ProductClass>('save', function () {
  this.slug = genSlug(this.title, this._id);
})
export class ProductClass {
  @Field({ nullable: true })
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

  @Field({ nullable: true })
  @prop()
  slug?: string;
}
/**
 * Generic Model to connect with mongoose from the Typegoose Class for Product
 */
export const ProductModel = getModelForClass(ProductClass);
