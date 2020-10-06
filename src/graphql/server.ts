import { ApolloServer, Config } from 'apollo-server';
/**
 *  This is the initialization of the ApolloServer that takes the config and starts the server
 *  @returns ApolloServer
 */

export const setupServer = async (config: Config) => {
  const server = new ApolloServer(config);

  server.listen({ port: 4000 }, () => {
    console.log('run graphql')
  });
  return server;
};
