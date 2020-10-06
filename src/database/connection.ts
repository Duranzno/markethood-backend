import { connect } from 'mongoose';

import { dbLogger } from '../logger';

import { mongoConfig } from './mongo.config';
let isConnected = false;

export const getMongoConnection = async () => {
  if (isConnected) {
    return Promise.resolve();
  }
  const defaultDb = process.env.DB_PATH;
  if (!defaultDb) {
    dbLogger.error('db error', new Error('DB_PATH is undefined'));
  }
  const dbUri: string = defaultDb as string;
  try {
    const db = await connect(dbUri, mongoConfig);
    dbLogger.info('Connected Successfully to the MongoDB database');
    isConnected = db.connection.readyState === 1; // 1 for connected
  } catch (error) {
    dbLogger.error('db error:', error);
    return Promise.reject(error);
  }
};
