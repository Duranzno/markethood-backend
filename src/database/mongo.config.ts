import { mongoose } from '@typegoose/typegoose';
import { IModelOptions } from '@typegoose/typegoose/lib/types';
import { ConnectionOptions } from 'mongoose';
/**
 * Default configuration for the Mongoose Connection
 */
export const mongoConfig: ConnectionOptions = {
  bufferCommands: false, // Disable mongoose buffering
  bufferMaxEntries: 0, // and MongoDB driver buffering
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};
/**
 * Default configuration for the MongooseModels
 * @returns IModelOptions
 */
export const modelConfig: IModelOptions = {
  existingMongoose: mongoose,
  schemaOptions: <mongoose.SchemaOptions>{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  options: {
    automaticName: true,
  },
};
