import test from 'ava';

import { setupMongo, setupMongoose } from '../../utils/testing.utils';

import { ProductStatus } from './common.model';
import { ProductModel } from './product.model';

test.before(async () => {
  const mongo = await setupMongo();
  await setupMongoose(await mongo.getUri());
});
test.serial('Basic Product Creation', async (t) => {
  const mockProduct = {
    title: 'Product',
    status: ProductStatus.finished,
    price: [100],
  };
  const product = await ProductModel.create(mockProduct);
  const p = await product.save();
  t.deepEqual(p.title, mockProduct.title, 'Problems with the title');
  t.deepEqual(p.status, mockProduct.status, 'Problems creating the status');
  t.deepEqual(
    p.slug,
    'product-' + product._id,
    "The pre-hook doesn't create the slug"
  );
});
