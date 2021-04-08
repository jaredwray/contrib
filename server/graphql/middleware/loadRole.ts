import { GraphqlHandler } from '../types';
import { loadInfluencer } from './loadInfluencer';

export function loadRole<Result, Args, Parent>(
  handler: GraphqlHandler<Result, Args, Parent>,
): GraphqlHandler<Result, Args, Parent> {
  return loadInfluencer(async (parent, args, context, info) => {
    if (context.currentAccount?.mongodbId && context.currentAssistant === undefined) {
      context.currentAssistant = await context.assistant.findAssistantByUserAccount(context.currentAccount.mongodbId);
      context.currentInfluencerId = context.currentInfluencer?.id || context.currentAssistant?.influencerId;
    }

    return handler(parent, args, context, info);
  });
}
