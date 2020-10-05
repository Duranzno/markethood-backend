import { ApolloServer, Config } from 'apollo-server';

export const setupServer = async (config: Config) => {
  const server = new ApolloServer(config);

  server.listen({ port: 4000 }, () => console.log('run graphql'));
  return server;
};
