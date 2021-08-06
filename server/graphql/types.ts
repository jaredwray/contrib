import { GraphqlContext } from './GraphqlContext';
import { GraphQLResolveInfo } from 'graphql/type/definition';

export type GraphqlHandler<Result, Args, Parent = unknown> = (
  parent: Parent,
  args: Args,
  context: GraphqlContext,
  info: GraphQLResolveInfo,
) => Promise<Result>;

export type GraphqlResolver<TResult, TArgs = { [argName: string]: any }, TSource = unknown> = (
  source: TSource,
  args: TArgs,
  context: GraphqlContext,
  info: GraphQLResolveInfo,
) => Promise<TResult>;

export type GraphqlSubscription = {
  subscribe: () => AsyncIterator<void>;
};
