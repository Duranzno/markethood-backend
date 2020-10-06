import { mongoose } from '@typegoose/typegoose';
import { ApolloServer } from 'apollo-server';
import {
  ApolloServerTestClient,
  createTestClient,
} from 'apollo-server-testing';
import anyTest, { TestInterface } from 'ava';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { getApolloConfig } from '../graphql';
dotenv.config();
export const setupMongo = (): MongoMemoryServer => {
  const config = process.env.CI ? { binary: { version: '4.4.1' } } : {};
  const m = new MongoMemoryServer(config);
  return m;
};
export const setupMongoose = async (uri: string) => {
  const connection = await mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  return connection;
};
export const test = anyTest as TestInterface<{
  testClient: ApolloServerTestClient;
  mongod?: MongoMemoryServer;
  connection?: typeof mongoose;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  temp?: any;
}>;
export const testApolloClient = async (): Promise<ApolloServerTestClient> => {
  const config = await getApolloConfig();
  const server = new ApolloServer(config);
  return createTestClient(server);
};
