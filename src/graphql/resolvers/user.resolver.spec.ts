import { gql } from 'apollo-server';

import { UserModel } from '../../database';
import {
  mockProduct,
  mockUser,
  setupMongo,
  setupMongoose,
  test,
  testApolloClient,
} from '../../utils/testing.utils';

const registerMutation = gql`
  mutation createUser(
    $name: String!
    $email: String!
    $phone: String!
    $password: String!
  ) {
    createUser(name: $name, email: $email, phone: $phone, password: $password) {
      _id
      name
      email
      password
      phone
    }
  }
`;
const updateUserMutation = gql`
  mutation updateUser($userId: String!, $name: String) {
    updateUser(name: $name, userId: $userId) {
      _id
      name
    }
  }
`;
const getUsersQuery = gql`
  {
    users {
      _id
      name
      email
      password
      phone
    }
  }
`;
const userQuery = gql`
  query singleUserQuery($id: String!) {
    user(id: $id) {
      _id
      name
    }
  }
`;
const deleteMutation = gql`
  mutation testDeleteUser($id: String!) {
    deleteUser(id: $id)
  }
`;
const addProductMutation = gql`
  mutation addProductMutation(
    $userId: String!
    $title: String!
    $status: String!
    $price: [Float!]!
  ) {
    addProduct(userId: $userId, title: $title, status: $status, price: $price) {
      slug
      title
    }
  }
`;
test.before(async (t) => {
  try {
    const mongod = setupMongo();
    const connection = await setupMongoose(await mongod.getUri());
    const testClient = await testApolloClient();
    t.context = { connection, mongod, testClient };
  } catch (error) {
    console.log('Error on the before hook');
    console.log(error);
  }
});

test.serial('Create User', async (t) => {
  const user = mockUser();
  //Acting

  const res = await t.context.testClient.mutate({
    mutation: registerMutation,
    variables: user,
  });
  const { data, errors } = res;

  //Asserting
  t.falsy(errors, 'Errors have been thrown');
  t.truthy(data, `Errors getting data ${JSON.stringify(data)}`);
  t.deepEqual(data?.createUser.name, user.name, 'message');
});
test.serial('Get Specific User', async (t) => {
  const users = await UserModel.find({});
  const user = users.pop();
  //Acting
  const res = await t.context.testClient.query({
    query: userQuery,
    variables: { id: user?.id },
  });
  const { data, errors } = res;

  //Asserting
  t.falsy(errors, 'Errors have been thrown');
  t.truthy(data, `Errors getting data ${JSON.stringify(data)}`);
  t.deepEqual(data?.user.name, user?.name, 'message');
});
test.serial('Get Users', async (t) => {
  //Acting
  const res = await t.context.testClient.query({ query: getUsersQuery });
  const { data, errors } = res;

  //Asserting
  t.falsy(errors, 'Errors have been thrown');
  t.truthy(data?.users, 'Errors getting data');
  t.deepEqual(data?.users?.length, 1, 'Error getting the amount of users');
});

test.serial('Add Product to User', async (t) => {
  // Expect
  const product = mockProduct();
  const { data: userData } = await t.context.testClient.query({
    query: getUsersQuery,
  });
  const user = userData?.users[0];
  //Act
  const res = await t.context.testClient.mutate({
    mutation: addProductMutation,
    variables: { userId: user?._id, ...product },
  });
  const { data, errors } = res;
  //Assert
  t.falsy(errors, 'Errors have been thrown');
  t.truthy(data, `Errors getting data ${JSON.stringify(data)}`);
  t.truthy(data?.addProduct?.slug, `Errors with slug created`);
  t.deepEqual(data?.addProduct?.title, product.title, 'Not the same product');
});

test.serial('Update User', async (t) => {
  const { data: userData } = await t.context.testClient.query({
    query: getUsersQuery,
  });
  const user = userData?.users[0];
  const name = 'New Name';
  //Acting

  const res = await t.context.testClient.mutate({
    mutation: updateUserMutation,
    variables: { userId: user._id, name },
  });
  const { data, errors } = res;

  //Asserting
  t.falsy(errors, 'Errors have been thrown');
  t.truthy(data, `Errors getting data ${JSON.stringify(data)}`);
  t.deepEqual(data?.updateUser.name, name, "Didn't update name");
});

test.serial('Update User Product', async (t) => {
  const { data: userData } = await t.context.testClient.query({
    query: getUsersQuery,
  });
  const user = userData?.users[0];
  const name = 'New Name';
  //Acting

  const res = await t.context.testClient.mutate({
    mutation: updateUserMutation,
    variables: { userId: user._id, name },
  });
  const { data, errors } = res;

  //Asserting
  t.falsy(errors, 'Errors have been thrown');
  t.truthy(data, `Errors getting data ${JSON.stringify(data)}`);
  t.deepEqual(data?.updateUser.name, name, "Didn't update name");
});
test.serial('Delete one of the users', async (t) => {
  //Expecting
  const q = gql`
    {
      users {
        _id
      }
    }
  `;
  const initialRes = await t.context.testClient.query({ query: q });
  t.falsy(initialRes?.errors, 'Errors have been thrown');
  t.truthy(initialRes?.data?.users.length, 'Incorrect number of users');

  //Acting
  const id = initialRes?.data?.users[0]?._id;
  t.truthy(id, 'Problems obtaining the slug');
  const deletedRes = await t.context.testClient.mutate({
    mutation: deleteMutation,
    variables: { id },
  });
  t.falsy(deletedRes?.errors, 'Errors have been thrown');
  t.deepEqual(deletedRes?.data?.deleteUser, id, 'Different object deleted');

  //Final Assertion
  const finalRes = await t.context.testClient.query({ query: q });
  t.falsy(finalRes?.errors, 'Errors have been thrown');
  t.deepEqual(
    finalRes.data?.users?.length,
    initialRes.data?.users?.length - 1,
    'Different object deleted'
  );
});

test.after.always(async (t) => {
  t.context.connection?.disconnect();
  t.context.mongod?.stop();
});
