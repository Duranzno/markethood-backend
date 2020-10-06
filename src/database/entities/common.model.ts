// import { ObjectType, Field } from 'type-graphql';
// import { prop } from '@typegoose/typegoose';

/**
 * These are all the possible states the product can be in
 */
export enum ProductStatus {
  on_going = 'on_going',
  finished = 'finished',
}
// export enum AllowedCurrencies {
//   USD = "USD",
//   VES = "VES",
//   BSF = "VES"
// }

// @ObjectType({ description: "Price" })
// export class Price {

//   @prop({ required: true })
//   @Field(type => Number, { nullable: false })
//   amount: Number;

//   @prop({ default: AllowedCurrencies.USD })
//   @Field(type => String, { nullable: false })
//   currency?: String;

//   @Field(type => String)
//   @prop()
//   code?: String;
// }
