import 'reflect-metadata';
import {
  // Arg,
  Args,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';

import { ProductClass, ProductStatus } from '../../database';

@Resolver(() => ProductClass)
export class ProductQuery {
  @Query(() => [ProductClass])
  async products() {
    return await [
      { title: 'Title', price: [], status: ProductStatus.on_going },
    ];
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
    return product; //await { title: "Title", price: [], status: ProductStatus.on_going }
  }

  // @Mutation(() => Product)
  // async updateProduct(@Args() product: Product) {
  //   return await {}
  // }
}
