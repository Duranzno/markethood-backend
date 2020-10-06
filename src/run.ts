// require("dotenv").config();
/**
 * Running function for the entire server.
 * The project is currently divided in two entities, those related to DB operations and those that configure the Apollo Configuration
 * This is the file that starts the runtime by:
 * * Setting up the Apollo Config implemented by type-graphql
 * * Running the Apollo server with that configuration
 * * Initializing the connection to MongoDB and enabling the correct use of Typegoose
 */
import { getApolloConfig, setupServer } from './graphql';

async function run() {
  try {
    const config = getApolloConfig();
    setupServer(config);
  } catch (error) {
    console.error(error);
  }
}
run();
