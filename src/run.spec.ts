import { gql } from 'apollo-server';

import { test, testApolloClient } from './utils/testing.utils';

const query = gql`
  {
    books {
      title
      author
    }
  }
`;

const expected = {
  books: [
    {
      title: 'The Awakening',
      author: 'Kate Chopin',
    },
    {
      title: 'City of Glass',
      author: 'Paul Auster',
    },
  ],
};
test.before(async (t) => {
  t.context.testClient = await testApolloClient();
});
test.skip('Basic Query', async (t) => {
  const { data, errors } = await t.context.testClient.query({ query });
  t.falsy(errors, 'Errors have been thrown');

  t.assert(data, 'No data coming from query call');
  t.deepEqual(data?.books, expected.books, 'Queried A different value');
});
