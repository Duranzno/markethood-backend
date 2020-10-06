import { Config } from 'apollo-server';

import { createSchema } from './schema';
/**
 *  This is the initialization of the ApolloConfig that takes the resolvers and classes made by typegoose
 *  @returns ApolloConfig
 */
export const getApolloConfig = async (): Promise<Config> => {
  const schema = await createSchema();
  return { schema };
};
