import { InviteInput } from './model/InviteInput';
import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { Invitation } from '../dto/Invitation';
import { requireAuthenticated } from '../../../graphql/middleware/requireAuthenticated';
import { AppError, ErrorCode } from '../../../errors';
import { GraphqlResolver } from '../../../graphql/types';
import { GraphqlContext } from '../../../graphql/GraphqlContext';

interface InvitationResolversType {
  Query: {
    invitation: GraphqlResolver<Invitation | null, { slug: string }>;
  };
  Mutation: {
    confirmAccountWithInvitation: GraphqlResolver<UserAccount, { otp: string; code: string }>;
    createAccountWithInvitation: GraphqlResolver<UserAccount, { code: string }>;
  };
}

export const InvitationResolvers: InvitationResolversType = {
  Query: {
    invitation: async (
      _: unknown,
      { slug }: { slug: string },
      { invitation }: GraphqlContext,
    ): Promise<Invitation | null> => {
      const foundInvitation = await invitation.findInvitationBySlug(slug);
      if (foundInvitation?.accepted) {
        return null;
      }
      return foundInvitation;
    },
  },
  Mutation: {
    confirmAccountWithInvitation: requireAuthenticated(async (_, { code, otp }, { user, userAccount, invitation }) => {
      const invitationModel = await invitation.findInvitationBySlug(code);
      if (!invitationModel || invitationModel.accepted) {
        throw new AppError('Invitation code is outdated', ErrorCode.BAD_REQUEST);
      }
      return userAccount.confirmAccountWithPhoneNumber(user.id, invitationModel.phoneNumber, otp);
    }),
    createAccountWithInvitation: requireAuthenticated(async (_, { code }, { user, userAccount, invitation }) => {
      const invitationModel = await invitation.findInvitationBySlug(code);
      if (!invitationModel || invitationModel.accepted) {
        throw new AppError('Invitation code is outdated', ErrorCode.BAD_REQUEST);
      }
      return userAccount.createAccountWithPhoneNumber(user.id, invitationModel.phoneNumber);
    }),
  },
};
