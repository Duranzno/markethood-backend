// import * as path from "path";

import { ObjectId } from 'mongodb';
import { buildSchema } from 'type-graphql';
import { Container as container } from 'typedi';

import { ObjectIdScalar } from './object-id.scalar';
import {
  // CommunityMutations,
  // UserMutations,
  ProductMutation,
  ProductQuery,
  // CommunityQuery,
  // UserQuery,
  // WatchlistMutations,
  // WatchlistQuery
} from './resolvers';
// import { authChecker } from "./auth"
// import { ResolveTime } from './middleware';

export const createSchema = async () =>
  await buildSchema({
    resolvers: [
      // CommunityMutations,
      // UserMutations,
      ProductMutation,
      ProductQuery,
      // CommunityQuery,
      // UserQuery,
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
