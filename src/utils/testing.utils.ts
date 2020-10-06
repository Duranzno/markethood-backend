import { ApolloServer } from 'apollo-server';
import {
  ApolloServerTestClient,
  createTestClient,
} from 'apollo-server-testing';
import anyTest, { TestInterface } from 'ava';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { getApolloConfig } from '../graphql';

export const setupMongo = (): MongoMemoryServer => {
  const config = process.env.CI ? { binary: { version: '4.4.1' } } : {};
  const m = new MongoMemoryServer(config);
  return m;
};
export const test = anyTest as TestInterface<{
  testClient: ApolloServerTestClient;
}>;
export const testApolloClient = async (): Promise<ApolloServerTestClient> => {
  const config = await getApolloConfig()
  const server = new ApolloServer(config);
  return createTestClient(server);
};
