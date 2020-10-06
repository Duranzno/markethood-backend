import { logger } from '@typegoose/typegoose/lib/logSettings';
import dotenv from 'dotenv';

import { getMongoConnection } from './database/connection';
import { getApolloConfig, setupServer } from './graphql';
/**
 * Running function for the entire server.
 * The project is currently divided in two entities, those related to DB operations and those that configure the Apollo Configuration
 * This is the file that starts the runtime by:
 * * Setting up the Apollo Config implemented by type-graphql
 * * Running the Apollo server with that configuration
 * * Initializing the connection to MongoDB and enabling the correct use of Typegoose
 */

async function run() {
  try {
    await getMongoConnection();
    const config = await getApolloConfig();
    setupServer(config);
  } catch (error) {
    logger.error(error);
  }
}
dotenv.config();
run();
