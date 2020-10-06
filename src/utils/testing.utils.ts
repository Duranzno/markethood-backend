import { MongoMemoryServer } from 'mongodb-memory-server';

export const setupMongo = (): MongoMemoryServer => {
  const config = process.env.CI ? { binary: { version: '4.4.1' } } : {};
  const m = new MongoMemoryServer(config);
  return m;
};
