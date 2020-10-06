import { errors } from '@typegoose/typegoose';
import { gql } from 'apollo-server';

import { ProductStatus } from '../../database/entities';
import { test, testApolloClient } from '../../utils/testing.utils';

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
mutation testRegisterProduct($title:String!, $status:String!, $price:[Float!]!){
  registerProduct(title: $title, status:$status,price:$price){
    title
    status
    price
  }
}`;
const expectedProduct = {
  title: 'Title',
  price: [],
  status: ProductStatus.on_going,
};
test.before(async (t) => {
  try {
    const client = await testApolloClient();
    t.context.testClient = client
  } catch (error) {
    console.log(errors)
  }
});
test.serial('Mutate to register a Product', async (t) => {
  const { data, errors } = await t.context.testClient.mutate({
    mutation,
    variables: expectedProduct,
  });
  t.falsy(errors, 'Errors have been thrown');
  t.assert(data, 'No data coming from created product call');
  t.deepEqual(data, { registerProduct: { ...expectedProduct } }, 'Not the same product');
});
test.serial('Query All Products', async (t) => {
  const { errors, data } = await t.context.testClient.query({ query });
  t.falsy(errors, 'Errors have been thrown');
  t.assert(data, 'No data coming from query call');
  t.deepEqual(data?.products, [expectedProduct], 'Queried A different value');
});
