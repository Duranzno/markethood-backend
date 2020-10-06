import test from 'ava';

import { setupMongoose } from '../../utils/testing.utils';

import { ProductStatus } from './common.model';
import { ProductModel } from './product.model';

test.before(async () => {
  await setupMongoose();
});
test.serial('Basic Product Creation', async (t) => {
  const product = await ProductModel.create({
    title: 'Product',
    status: ProductStatus.finished,
    price: [100],
  });
  const p = await product.save();
  t.deepEqual(p.title, 'Product', 'message');
});
