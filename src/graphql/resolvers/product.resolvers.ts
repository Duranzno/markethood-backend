import 'reflect-metadata';
import {
  // Arg,
  Args,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';

import { ProductClass, ProductModel } from '../../database';

@Resolver(() => ProductClass)
export class ProductQuery {
  @Query(() => [ProductClass])
  async products() {
    return await ProductModel.find();
  }

  // @Query(() => Product)
  // async Product(
  //   @Arg("title", { nullable: true }) title?: String,
  //   @Arg("id", { nullable: true }) id?: String
  // ) {
  //   return await []
  // }
}
@Resolver(() => ProductClass)
export class ProductMutation {
  @Mutation(() => ProductClass)
  async registerProduct(@Args() product: ProductClass) {
    return await (await ProductModel.create(product)).save();
  }

  // @Mutation(() => Product)
  // async updateProduct(@Args() product: Product) {
  //   return await {}
  // }
}
