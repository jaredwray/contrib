import { GraphqlContext } from './GraphqlContext';

export type GraphqlHandler<Result, Args> = (
  parent: unknown,
  args: Args,
  context: GraphqlContext,
  info: unknown,
) => Promise<Result>;
