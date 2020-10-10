import test from 'ava';

import {
  mockProduct,
  mockUser,
  setupMongo,
  setupMongoose,
} from '../../utils/testing.utils';

import { ProductModel } from './product.model';
import { UserModel } from './user.model';

test.before(async () => {
  const mongo = await setupMongo();
  await setupMongoose(await mongo.getUri());
});

test.serial('Basic User Creation', async (t) => {
  const mockU = mockUser();

  const user = await UserModel.create({ ...mockU });
  const u = await user.save();
  t.deepEqual(u.name, mockU.name, 'Problems with the user creation');
});

test.serial('Add Product to User', async (t) => {
  //Act
  const defUser = await (await UserModel.create(mockUser())).save();
  const product = await defUser.addProduct(mockProduct());
  const u = await UserModel.findOne({}).populate('products');

  //Assert
  t.truthy(u?.products, 'Problems adding products member ');
  t.deepEqual(
    u?.products?.length,
    1,
    'Problems adding the sub-document Product'
  );
  const p = u?.products?.pop();

  t.deepEqual(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    p?.title,
    product.title,
    'Problems adding the sub-document Product'
  );
});

test.afterEach(async () => {
  await UserModel.deleteMany({});
  await ProductModel.deleteMany({});
});
