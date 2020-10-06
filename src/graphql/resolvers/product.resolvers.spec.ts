import { errors } from '@typegoose/typegoose';
import { gql } from 'apollo-server';

import { ProductModel, ProductStatus } from '../../database/entities';
import {
  setupMongoose,
  test,
  testApolloClient,
} from '../../utils/testing.utils';

const query = gql`
  {
    products {
      title
      price
      status
    }
  }
`;
const mutation = gql`
  mutation testRegisterProduct(
    $title: String!
    $status: String!
    $price: [Float!]!
  ) {
    registerProduct(title: $title, status: $status, price: $price) {
      title
      status
      price
    }
  }
`;
const expectedProduct = {
  title: 'Title',
  price: [],
  status: ProductStatus.on_going,
};

test.before(async (t) => {
  try {
    const { connection, mongo } = await setupMongoose();
    const client = await testApolloClient();
    t.context = { connection, mongod: mongo, testClient: client };
  } catch (error) {
    console.log(errors);
  }
});

test.serial('Mutate to register a Product', async (t) => {
  const { data, errors } = await t.context.testClient.mutate({
    mutation,
    variables: expectedProduct,
  });
  t.falsy(errors, 'Errors have been thrown');
  t.assert(data, 'No data coming from created product call');
  t.deepEqual(
    data,
    { registerProduct: { ...expectedProduct } },
    'Not the same product'
  );
});
test.serial('Query All Products', async (t) => {
  const expected = [expectedProduct, expectedProduct];
  (await ProductModel.create(expectedProduct)).save();
  (await ProductModel.create(expectedProduct)).save();
  const { errors, data } = await t.context.testClient.query({ query });
  t.falsy(errors, 'Errors have been thrown');
  t.assert(data, 'No data coming from query call');
  t.deepEqual(data?.products.length, 2, 'Different amount of products queried');
  t.deepEqual(data?.products, expected, 'Queried A different value');
  t.deepEqual(data?.products[0], expectedProduct, 'Queried A different value');
});
test.afterEach(async () => {
  await ProductModel.deleteMany({});
});
test.after.always(async (t) => {
  t.context.connection?.disconnect();
  t.context.mongod?.stop();
});
