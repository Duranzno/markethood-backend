import { ApolloServer, Config } from 'apollo-server';

import { logger } from '../logger';
/**
 *  This is the initialization of the ApolloServer that takes the config and starts the server
 *  @returns ApolloServer
 */

export const setupServer = async (config: Config) => {
  const server = new ApolloServer(config);

  server.listen({ port: 4000 }, () => {
    logger.info('Started ApolloServer Correctly');
  });
  return server;
};
