import { Assistant } from '../dto/Assistant';
import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { InviteInput } from '../../Invitation/graphql/model/InviteInput';
import { Invitation } from '../../Invitation/dto/Invitation';
import { requireAdmin } from '../../../graphql/middleware/requireAdmin';
import { loadAccount } from '../../../graphql/middleware/loadAccount';
import { requireRole } from '../../../graphql/middleware/requireRole';
import { GraphqlResolver } from '../../../graphql/types';

interface AssistantResolversType {
  Mutation: {
    inviteAssistant: GraphqlResolver<{ invitationId: string }, { input: InviteInput }>;
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
        if (!userAccount.mongodbId || !hasAccess) return null;

        return loaders.assistant.getByUserAccountId(userAccount.mongodbId);
      },
    ),
  },
};
