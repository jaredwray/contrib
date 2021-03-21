import { GraphqlContext } from './GraphqlContext';
import { GraphQLResolveInfo } from 'graphql/type/definition';

export type GraphqlHandler<Result, Args> = (
  parent: unknown,
  args: Args,
  context: GraphqlContext,
  info: unknown,
) => Promise<Result>;

export type GraphqlResolver<TResult, TArgs = { [argName: string]: any }, TSource = unknown> = (
  source: TSource,
  args: TArgs,
  context: GraphqlContext,
  info: GraphQLResolveInfo,
) => Promise<TResult>;
