import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing'
import anyTest, { TestInterface } from 'ava'
import { gql } from 'apollo-server'
import { getApolloConfig, setupServer } from './graphql';
const query = gql`
{
  books{
    title
    author
  }
}
`
const test = anyTest as TestInterface<{
  testClient: ApolloServerTestClient,
}>;
const expected = {
  books: [{
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },]
}
let testClient: ApolloServerTestClient;
test.before(async t => {
  const server = await setupServer(getApolloConfig())
  testClient = createTestClient(server)
  t.context.testClient = testClient
});
test('Basic Query', async t => {
  const { data } = await t.context.testClient.query({ query })
  t.assert(data, "No data coming from query call")
  t.deepEqual(data?.books, expected.books, 'Queried A different value');
});
