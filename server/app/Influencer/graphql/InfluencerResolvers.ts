import { InviteInfluencerInput } from './model/InviteInfluencerInput';
import { GraphqlContext } from '../../../graphql/GraphqlContext';
import { InfluencerProfile } from '../dto/InfluencerProfile';
import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { UpdateInfluencerProfileInput } from './model/UpdateInfluencerProfileInput';
import { Invitation } from '../dto/Invitation';
import { requireAuthenticated } from '../../../graphql/middleware/requireAuthenticated';
import { AppError, ErrorCode } from '../../../errors';
import { requireAdmin } from '../../../graphql/middleware/requireAdmin';
import { requireInfluencer } from '../../../graphql/middleware/requireInfluencer';
import { loadAccount } from '../../../graphql/middleware/loadAccount';

export const InfluencerResolvers = {
  Query: {
    invitation: async (
      parent: unknown,
      { slug }: { slug: string },
      { invitation }: GraphqlContext,
    ): Promise<Invitation | null> => {
      const foundInvitation = await invitation.findInvitationBySlug(slug);
      if (foundInvitation?.accepted) {
        return null;
      }
      return foundInvitation;
    },
    influencers: requireAdmin(
      async (
        parent,
        { size, skip }: { size: number; skip: number },
        { influencer },
      ): Promise<{ items: InfluencerProfile[]; totalItems: number; size: number; skip: number }> => ({
        items: await influencer.listInfluencers(skip, size),
        totalItems: await influencer.countInfluencers(),
        size,
        skip,
      }),
    ),
    influencer: (_, { id }: { id: string }, { influencer }: GraphqlContext) => {
      return influencer.findInfluencer(id);
    },
  },
  Mutation: {
    inviteInfluencer: requireAdmin(async (parent, { input }: { input: InviteInfluencerInput }, { invitation }) =>
      invitation.inviteInfluencer(input),
    ),
    updateMyInfluencerProfile: requireInfluencer(
      async (_: unknown, { input }: { input: UpdateInfluencerProfileInput }, { influencer, currentAccount }) =>
        influencer.updateInfluencerProfileByUserId(currentAccount.mongodbId, input),
    ),
    updateMyInfluencerProfileAvatar: requireInfluencer(
      async (_: unknown, { image }: { image: any }, { influencer, currentAccount }) =>
        influencer.updateInfluencerProfileAvatarByUserId(currentAccount.mongodbId, image),
    ),
    updateMyInfluencerProfileFavoriteCharities: requireInfluencer(
      async (_: unknown, { charities }: { charities: [string] }, { influencer, currentAccount }) =>
        influencer.updateInfluencerProfileFavoriteCharitiesByUserId(currentAccount.mongodbId, charities),
    ),
    confirmAccountWithInvitation: requireAuthenticated(
      async (parent, { code, otp }: { otp: string; code: string }, { user, userAccount, invitation }) => {
        const invitationModel = await invitation.findInvitationBySlug(code);
        if (!invitationModel || invitationModel.accepted) {
          throw new AppError('Invitation code is outdated', ErrorCode.BAD_REQUEST);
        }
        return userAccount.confirmAccountWithPhoneNumber(user.id, invitationModel.phoneNumber, otp);
      },
    ),
    createAccountWithInvitation: requireAuthenticated(
      async (parent: unknown, { code }: { code: string }, { user, userAccount, invitation }) => {
        const invitationModel = await invitation.findInvitationBySlug(code);
        if (!invitationModel || invitationModel.accepted) {
          throw new AppError('Invitation code is outdated', ErrorCode.BAD_REQUEST);
        }
        return userAccount.createAccountWithPhoneNumber(user.id, invitationModel.phoneNumber);
      },
    ),
  },
  InfluencerProfile: {
    userAccount: requireAdmin(
      async (parent: InfluencerProfile, _, { loaders }) =>
        (parent.userAccount && (await loaders.userAccount.getById(parent.userAccount))) ?? null,
    ),
    invitation: requireAdmin(async (parent: InfluencerProfile, _, { loaders }) =>
      loaders.invitation.getByInfluencerId(parent.id),
    ),
    favoriteCharities: requireInfluencer(async (parent: InfluencerProfile, _, { loaders }) =>
      Promise.all(parent.favoriteCharities.map((c) => loaders.charity.getById(c))),
    ),
  },
  UserAccount: {
    influencerProfile: loadAccount(
      async (
        parent: UserAccount,
        _: unknown,
        { user, currentAccount, loaders }: GraphqlContext,
      ): Promise<InfluencerProfile | null> => {
        const hasAccess = currentAccount?.isAdmin || user?.id === parent.id;
        if (!parent.mongodbId || !hasAccess) {
          return null;
        }
        return loaders.influencer.getByUserAccountId(parent.mongodbId);
      },
    ),
  },
};
