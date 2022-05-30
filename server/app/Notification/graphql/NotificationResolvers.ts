import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { Invitation } from '../dto/Invitation';
import { requireAdmin } from '../../../graphql/middleware/requireAdmin';
import { requireRole } from '../../../graphql/middleware/requireRole';
import { requireAuthenticated } from '../../../graphql/middleware/requireAuthenticated';
import { AppError, ErrorCode } from '../../../errors';
import { GraphqlResolver } from '../../../graphql/types';
import { GraphqlContext } from '../../../graphql/GraphqlContext';
import { InviteInput } from '../dto/InviteInput';
import { InvitationsParams } from '../dto/InvitationsParams';

interface InvitationResolversType {
  Query: {
    invitation: GraphqlResolver<Invitation | null, { slug: string }>;
    invitations: GraphqlResolver<
      { items: Invitation[]; totalItems: number; size: number; skip: number },
      { params: InvitationsParams }
    >;
  };
  Mutation: {
    inviteAssistant: GraphqlResolver<{ invitationId: string }, { input: InviteInput }>;
    inviteInfluencer: GraphqlResolver<{ invitationId: string }, { input: InviteInput }>;
    inviteCharity: GraphqlResolver<{ invitationId: string }, { input: InviteInput }>;
    resendInviteMessage: GraphqlResolver<
      { link: string; phoneNumber: string; firstName: string },
      { influencerId: string }
    >;
    approveInvitation: GraphqlResolver<Invitation | null, { id: string }>;
    declineInvitation: GraphqlResolver<Invitation | null, { id: string }>;
    confirmAccountWithInvitation: GraphqlResolver<UserAccount, { otp: string; code: string }>;
    createAccountWithInvitation: GraphqlResolver<UserAccount, { code: string }>;
    proposeInvitation: GraphqlResolver<{ invitationId: string }, { input: InviteInput }>;
  };
}

export const InvitationResolvers: InvitationResolversType = {
  Query: {
    invitation: async (
      _: unknown,
      { slug }: { slug: string },
      { invitation }: GraphqlContext,
    ): Promise<Invitation | null> => {
      return await invitation.findInvitationBySlug(slug);
    },
    invitations: requireAdmin(async (_, { params }, { invitation }) => invitation.invitations(params)),
  },
  Mutation: {
    inviteAssistant: requireRole(async (_, { input }, { invitation }) => invitation.inviteAssistant(input)),
    inviteCharity: requireAdmin(async (_, { input }, { invitation }) => invitation.inviteCharity(input)),
    inviteInfluencer: requireAdmin(async (_, { input }, { invitation }) => invitation.inviteInfluencer(input)),
    resendInviteMessage: requireAdmin(
      async (_, { influencerId }, { invitation }) => await invitation.resendInviteMessage(influencerId),
    ),
    confirmAccountWithInvitation: requireAuthenticated(async (_, { code, otp }, { user, userAccount, invitation }) => {
      const invitationModel = await invitation.findInvitationBySlug(code);
      if (!invitationModel || invitationModel.accepted)
        throw new AppError('Invitation code is outdated', ErrorCode.BAD_REQUEST);

      return userAccount.confirmAccountWithPhoneNumber(user.id, invitationModel.phoneNumber, otp);
    }),
    createAccountWithInvitation: requireAuthenticated(async (_, { code }, { user, userAccount, invitation }) => {
      const invitationModel = await invitation.findInvitationBySlug(code);
      if (!invitationModel || invitationModel.accepted)
        throw new AppError('Invitation code is outdated', ErrorCode.BAD_REQUEST);

      return userAccount.createAccountWithPhoneNumber(user.id, invitationModel.phoneNumber);
    }),
    approveInvitation: requireAdmin(async (_, { id }, { invitation }) => invitation.approve(id)),
    declineInvitation: requireAdmin(async (_, { id }, { invitation }) => invitation.decline(id)),
    proposeInvitation: async (_, { input }, { invitation }) => invitation.createProposed(input),
  },
};
