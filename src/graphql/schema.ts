// import * as path from "path";

import { ObjectId } from 'mongodb';
import { buildSchema } from 'type-graphql';
import { Container as container } from 'typedi';

import { ObjectIdScalar } from './object-id.scalar';
import {
  // CommunityMutations,
  ProductMutations,
  ProductQueries,
  // CommunityQuery,
  UserMutations,
  UserQueries,
  // WatchlistMutations,
  // WatchlistQuery
} from './resolvers';
// import { authChecker } from "./auth"
// import { ResolveTime } from './middleware';
/**
 * Schema Creator to convert Typegoose to a generic Apollo schema
 */
export const createSchema = async () =>
  await buildSchema({
    resolvers: [
      // CommunityMutations,
      UserMutations,
      ProductMutations,
      ProductQueries,
      // CommunityQuery,
      UserQueries,
      // WatchlistMutations,
      // WatchlistQuery
    ],
    scalarsMap: [
      {
        type: ObjectId,
        scalar: ObjectIdScalar,
      },
    ],
    // emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    // globalMiddlewares: [ResolveTime],
    // authChecker,
    validate: false,
    container,
    authMode: 'null',
  });
