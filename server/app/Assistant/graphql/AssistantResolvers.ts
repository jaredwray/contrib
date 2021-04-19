import { Assistant } from '../dto/Assistant';
import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { InviteInput } from '../../Invitation/graphql/model/InviteInput';
import { Invitation } from '../../Invitation/dto/Invitation';
import { InfluencerProfile } from '../../Influencer/dto/InfluencerProfile';
import { requireAuthenticated } from '../../../graphql/middleware/requireAuthenticated';
import { AppError, ErrorCode } from '../../../errors';
import { requireAdmin } from '../../../graphql/middleware/requireAdmin';
import { requireInfluencer } from '../../../graphql/middleware/requireInfluencer';
import { loadAccount } from '../../../graphql/middleware/loadAccount';
import { loadInfluencer } from '../../../graphql/middleware/loadInfluencer';
import { requireRole } from '../../../graphql/middleware/requireRole';
import { GraphqlResolver } from '../../../graphql/types';

interface AssistantResolversType {
  Mutation: {
    inviteAssistant: GraphqlResolver<Assistant, { input: InviteInput }>;
    acceptAssistantTerms: GraphqlResolver<Assistant, { version: string }>;
  };
  Assistant: {
    userAccount: GraphqlResolver<UserAccount, Record<string, never>, Assistant>;
    invitation: GraphqlResolver<Invitation, Record<string, never>, Assistant>;
  };
  UserAccount: {
    assistant: GraphqlResolver<Assistant, Record<string, never>, UserAccount>;
  };
}

export const AssistantResolvers: AssistantResolversType = {
  Mutation: {
    inviteAssistant: requireRole(async (_, { input }, { invitation }) => invitation.inviteAssistant(input)),
    acceptAssistantTerms: requireRole(async (_, { version }, { assistant, currentAssistant }) =>
      assistant.acceptTerms(currentAssistant.id, version),
    ),
  },
  Assistant: {
    userAccount: requireAdmin(
      async (assistant: Assistant, _, { loaders }) =>
        (assistant.userAccount && (await loaders.userAccount.getById(assistant.userAccount))) ?? null,
    ),
    invitation: requireAdmin(async (assistant: Assistant, _, { loaders }) =>
      loaders.invitation.getByParentEntityId(assistant.id),
    ),
  },
  UserAccount: {
    assistant: loadAccount(
      async (userAccount: UserAccount, _, { user, currentAccount, loaders }): Promise<Assistant | null> => {
        const hasAccess = currentAccount?.isAdmin || user?.id === userAccount.id;
        if (!userAccount.mongodbId || !hasAccess) {
          return null;
        }
        return loaders.assistant.getByUserAccountId(userAccount.mongodbId);
      },
    ),
  },
};
