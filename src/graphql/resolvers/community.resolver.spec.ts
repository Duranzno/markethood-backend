// import { gql } from 'apollo-server';
// import { UserModel } from '../../database';
import {
  // mockProduct,
  // mockUser,
  // mockCommunity,
  setupMongo,
  setupMongoose,
  test,
  testApolloClient,
} from '../../utils/testing.utils';

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
test.todo('Add User to Community');
test.after.always(async (t) => {
  t.context.connection?.disconnect();
  t.context.mongod?.stop();
});
