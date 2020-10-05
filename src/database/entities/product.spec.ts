import { getModelForClass, mongoose } from "@typegoose/typegoose";
import test from "ava";
import { MongoMemoryServer } from 'mongodb-memory-server'

import { ProductStatus } from "./common.model";
import { ProductClass } from "./product.model";
const mongo = new MongoMemoryServer()
const Product = getModelForClass(ProductClass);
test.before(async () => {
  const uri = await mongo.getUri();
  await mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
});
test.serial("Basic Product Creation", async t => {
  const product = await Product.create({ title: "Product", status: ProductStatus.finished, price: [100] })
  const p = await product.save()
  t.deepEqual(p.title, "Product2", 'message');
})

