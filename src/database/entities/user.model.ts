import 'reflect-metadata';
import {
  DocumentType,
  getModelForClass,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { ArgsType, Field, ObjectType } from 'type-graphql';

import { ProductClass, ProductModel } from './product.model';

/** This is the class used for Users that will exist in the Database.
 *  Implementing Decorators it will be used as:
 *  * A type-graphql Object
 *  * A typegoose class to create the mongoose model
 *  * A type-graphql Argument (when creating or updating)
 * User will own Products
 * Users will be owned by Communities.
 */
@ArgsType()
@ObjectType({ description: 'Neighbors' })
export class UserClass {
  @Field()
  readonly _id?: ObjectId;

  @Field()
  @prop({
    required: true,
    unique: true,
    index: true,
  })
  name!: string;

  @Field()
  @prop({
    required: true,
    unique: true,
  })
  email!: string;

  @Field()
  @prop({
    required: true,
    unique: true,
  })
  phone!: string;

  @Field()
  @prop({
    required: true,
  })
  password!: string;

  @Field()
  @prop({})
  payment?: string;

  @Field()
  @prop({})
  pretty_location?: string;

  @prop({ ref: () => ProductClass, default: [] })
  public products?: Ref<ProductClass>[];

  public async addProduct(
    this: DocumentType<UserClass>,
    product: ProductClass
  ) {
    const p = await ProductModel.create(product);
    this.products = [...(this.products || []), p];
    this.markModified('products');
    await this.save();
    return p;
  }
}
export const UserModel = getModelForClass(UserClass);
