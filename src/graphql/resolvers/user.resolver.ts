import 'reflect-metadata';
import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';

import { ProductClass, UserClass, UserModel } from '../../database';
import { trimUndefined } from '../../utils';

@Resolver(() => UserClass)
export class UserQueries {
  @Query(() => [UserClass])
  async users() {
    return await UserModel.find({}).populate('products');
  }
  @Query(() => UserClass, { nullable: true })
  async user(@Arg('id') id: string) {
    return await UserModel.findOne({ _id: id }).populate('products');
  }
}

@Resolver(() => UserClass)
export class UserMutations {
  @Mutation(() => UserClass)
  async createUser(@Args() user: UserClass) {
    return await (await UserModel.create(user)).save();
  }
  @Mutation(() => ProductClass)
  async addProduct(
    @Arg('userId') userId: string,
    @Args() product: ProductClass
  ) {
    const user = await UserModel.findById(userId);
    const p = await user?.addProduct(product);
    return p;
  }
  @Mutation(() => UserClass)
  async updateUser(
    @Arg('userId') id: string,
    @Arg('email', { nullable: true }) email: string,
    @Arg('phone', { nullable: true }) phone: string,
    @Arg('payment', { nullable: true }) payment: string,
    @Arg('name', { nullable: true }) name: string,
    @Arg('pretty_location', { nullable: true }) pretty_location: string
  ) {
    const updatedUser = trimUndefined({
      email,
      phone,
      payment,
      name,
      pretty_location,
    });
    const user = await UserModel.findByIdAndUpdate(id, updatedUser, {
      useFindAndModify: false,
      new: true,
    });
    return user;
  }
  //TODO: Change Password
  @Mutation(() => String)
  async deleteUser(@Arg('id') id: string) {
    await UserModel.deleteOne({ _id: id });
    return id;
  }
}
