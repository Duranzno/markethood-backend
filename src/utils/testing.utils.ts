import { mongoose } from '@typegoose/typegoose';
import { ApolloServer } from 'apollo-server';
import {
  ApolloServerTestClient,
  createTestClient,
} from 'apollo-server-testing';
import { ApolloConfig } from 'apollo-server-types';
import anyTest, { TestInterface } from 'ava';
import chance from 'chance';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { ProductStatus } from '../database';
import { mongoConfig } from '../database/mongo.config';
import { getApolloConfig } from '../graphql';

dotenv.config();
const c = chance();

export const setupMongo = (): MongoMemoryServer => {
  const config = process.env.CI ? { binary: { version: '4.4.1' } } : {};
  const m = new MongoMemoryServer(config);
  return m;
};
export const setupMongoose = async (uri: string) => {
  const connection = await mongoose.connect(uri, mongoConfig);
  return connection;
};
export const test = anyTest as TestInterface<{
  testClient: ApolloServerTestClient;
  mongod?: MongoMemoryServer;
  connection?: typeof mongoose;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  temp?: any;
}>;
export const testApolloClient = async (
  config?: ApolloConfig
): Promise<ApolloServerTestClient> => {
  const defaultConfig = await getApolloConfig();
  const server = new ApolloServer({ ...defaultConfig, ...config });
  return createTestClient(server);
};
export const mockUser = () => ({
  name: c.name(),
  email: c.email(),
  phone: c.phone(),
  password: c.guid(),
  // payment: c.paragraph(),
  // pretty_location: c.paragraph(),
});
export const mockProduct = () => ({
  title: c.sentence({ words: 5 }),
  published_at: c.date(),
  status: c.pickone(Object.values(ProductStatus)),
  price: [],
});
