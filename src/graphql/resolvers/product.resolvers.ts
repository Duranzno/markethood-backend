import 'reflect-metadata';
import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';

import { genSlug, ProductClass, ProductModel } from '../../database';

@Resolver(() => ProductClass)
export class ProductQuery {
  @Query(() => [ProductClass])
  async products() {
    return await ProductModel.find();
  }
}
@Resolver(() => ProductClass)
export class ProductMutation {
  @Mutation(() => ProductClass)
  async registerProduct(@Args() product: ProductClass) {
    return await (await ProductModel.create(product)).save();
  }

  @Mutation(() => ProductClass)
  async updateProduct(@Args() product: ProductClass) {
    const p = await ProductModel.findOneAndUpdate(
      { slug: product.slug },
      product,
      {
        useFindAndModify: false,
        new: true,
      }
    );
    if (p) {
      const newSlug = genSlug(p.title, p._id);
      p.set({ slug: newSlug });
      return await p.save();
    } else {
      return Error("Product doesn't exists"); //TODO: ERROR HANDLING FOR APOLLO
    }
  }
  @Mutation(() => String)
  async deleteProduct(@Arg('slug') slug: string) {
    await ProductModel.deleteOne({ slug });
    return slug;
  }
}
