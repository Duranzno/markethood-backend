import { errors } from '@typegoose/typegoose';
import { gql } from 'apollo-server';

import { ProductModel, ProductStatus } from '../../database/entities';
import {
  setupMongo,
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
const registerMutation = gql`
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
const deleteMutation = gql`
  mutation testDeleteProduct($slug: String!) {
    deleteProduct(slug: $slug)
  }
`;
const updateMutation = gql`
  mutation testUpdateProduct(
    $title: String!
    $status: String!
    $price: [Float!]!
    $slug: String!
  ) {
    updateProduct(slug: $slug, title: $title, status: $status, price: $price) {
      title
      status
      price
      slug
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
    const mongod = setupMongo();
    const connection = await setupMongoose(await mongod.getUri());
    const testClient = await testApolloClient();
    await ProductModel.deleteMany({});

    t.context = { connection, mongod, testClient };
    t.context.temp = await (await ProductModel.create(expectedProduct)).save();
  } catch (error) {
    console.log('Error on the before hook');
    console.log(errors);
  }
});

test.serial('Mutate to register a Product', async (t) => {
  //Acting
  const res = await t.context.testClient.mutate({
    mutation: registerMutation,
    variables: { ...expectedProduct },
  });
  const { data, errors } = res;

  //Asserting
  t.falsy(errors, 'Errors have been thrown');
  t.assert(data, 'No data coming from created product call');
  t.deepEqual(
    data,
    { registerProduct: { ...expectedProduct } },
    'Not the same product'
  );
});

test.serial('Query All Products', async (t) => {
  //Expecting
  const expected = [expectedProduct, expectedProduct];

  //Acting
  const { errors, data } = await t.context.testClient.query({ query });
  //Asserting
  t.falsy(errors, 'Errors have been thrown');
  t.assert(data, 'No data coming from query call');
  t.deepEqual(data?.products.length, 2, 'Different amount of products queried');
  t.deepEqual(data?.products, expected, 'Queried A different value');
  t.deepEqual(data?.products[0], expectedProduct, 'Queried A different value');
});

test.serial('Update one of the products', async (t) => {
  //Expecting

  const slug = t.context?.temp?.slug;
  const title = 'Updated-Variable';
  t.assert(slug, 'Slug not created correctly');
  const variables = {
    slug,
    title,
    status: expectedProduct.status,
    price: expectedProduct.price,
  };

  //Acting
  const { data, errors } = await t.context.testClient.mutate({
    mutation: updateMutation,
    variables,
  });

  //Asserting
  t.falsy(errors, 'Errors have been thrown');
  t.truthy(data, 'Not generated data');
  t.deepEqual(data?.updateProduct?.title, title, 'Title did not change');
  t.notDeepEqual(data?.updateProduct?.slug, slug, 'Slug did not change');
});

test.serial('Delete one of the products', async (t) => {
  //Expecting
  const q = gql`
    {
      products {
        slug
      }
    }
  `;
  const initialRes = await t.context.testClient.query({ query: q });
  t.falsy(initialRes?.errors, 'Errors have been thrown');
  t.truthy(initialRes?.data?.products.length, 'Incorrect number of products');

  //Acting
  const slug = initialRes?.data?.products[0]?.slug;
  t.truthy(slug, 'Problems obtaining the slug');
  const deletedRes = await t.context.testClient.mutate({
    mutation: deleteMutation,
    variables: { slug: slug },
  });
  t.falsy(deletedRes?.errors, 'Errors have been thrown');
  t.deepEqual(
    deletedRes?.data?.deleteProduct,
    slug,
    'Different object deleted'
  );

  //Final Assertion
  const finalRes = await t.context.testClient.query({ query: q });
  t.falsy(finalRes?.errors, 'Errors have been thrown');
  t.deepEqual(
    finalRes.data?.products?.length,
    initialRes.data?.products?.length - 1,
    'Different object deleted'
  );
});
test.after.always(async (t) => {
  t.context.connection?.disconnect();
  t.context.mongod?.stop();
});
