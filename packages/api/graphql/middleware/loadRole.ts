import { GraphqlHandler } from '../types';
import { loadInfluencer } from './loadInfluencer';

export function loadRole<Result, Args, Parent>(
  handler: GraphqlHandler<Result, Args, Parent>,
): GraphqlHandler<Result, Args, Parent> {
  return loadInfluencer(async (parent, args, context, info) => {
    if (context.currentAccount?.mongodbId && context.currentAssistant === undefined) {
      context.currentAssistant = await context.assistant.findByUserAccount(context.currentAccount.mongodbId);
      context.currentInfluencerId = context.currentInfluencer?.id;
      context.currentInfluencerIds = context.currentInfluencerId
        ? [context.currentInfluencerId]
        : context.currentAssistant?.influencerIds || [];
    }

    return handler(parent, args, context, info);
  });
}
