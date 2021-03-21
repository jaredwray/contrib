import { InviteInfluencerInput } from './model/InviteInfluencerInput';
import { InfluencerProfile } from '../dto/InfluencerProfile';
import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { UpdateInfluencerProfileInput } from './model/UpdateInfluencerProfileInput';
import { Invitation } from '../dto/Invitation';
import { requireAuthenticated } from '../../../graphql/middleware/requireAuthenticated';
import { AppError, ErrorCode } from '../../../errors';
import { requireAdmin } from '../../../graphql/middleware/requireAdmin';
import { requireInfluencer } from '../../../graphql/middleware/requireInfluencer';
import { loadAccount } from '../../../graphql/middleware/loadAccount';
import { GraphqlResolver } from '../../../graphql/types';
import { Charity } from '../../Charity/dto/Charity';

interface InfluencerResolversType {
  Query: {
    invitation: GraphqlResolver<Invitation | null, { slug: string }>;
    influencers: GraphqlResolver<
      { items: InfluencerProfile[]; totalItems: number; size: number; skip: number },
      { size: number; skip: number }
    >;
    influencer: GraphqlResolver<InfluencerProfile, { id: string }>;
  };
  Mutation: {
    inviteInfluencer: GraphqlResolver<InfluencerProfile, { input: InviteInfluencerInput }>;
    updateMyInfluencerProfile: GraphqlResolver<InfluencerProfile, { input: UpdateInfluencerProfileInput }>;
    updateMyInfluencerProfileAvatar: GraphqlResolver<InfluencerProfile, { image: any }>;
    updateMyInfluencerProfileFavoriteCharities: GraphqlResolver<InfluencerProfile, { charities: [string] }>;
    confirmAccountWithInvitation: GraphqlResolver<UserAccount, { otp: string; code: string }>;
    createAccountWithInvitation: GraphqlResolver<UserAccount, { code: string }>;
  };
  InfluencerProfile: {
    userAccount: GraphqlResolver<UserAccount, Record<string, never>, InfluencerProfile>;
    invitation: GraphqlResolver<Invitation, Record<string, never>, InfluencerProfile>;
    favoriteCharities: GraphqlResolver<Charity[], Record<string, never>, InfluencerProfile>;
  };
  UserAccount: {
    influencerProfile: GraphqlResolver<InfluencerProfile, Record<string, never>, UserAccount>;
  };
}

export const InfluencerResolvers: InfluencerResolversType = {
  Query: {
    invitation: async (_: unknown, { slug }, { invitation }): Promise<Invitation | null> => {
      const foundInvitation = await invitation.findInvitationBySlug(slug);
      if (foundInvitation?.accepted) {
        return null;
      }
      return foundInvitation;
    },
    influencers: requireAdmin(async (_, { size, skip }, { influencer }) => ({
      items: await influencer.listInfluencers(skip, size),
      totalItems: await influencer.countInfluencers(),
      size,
      skip,
    })),
    influencer: loadAccount((_, { id }, { currentAccount, influencer }) =>
      id === 'me' && currentAccount
        ? influencer.findInfluencerByUserAccount(currentAccount.mongodbId)
        : influencer.findInfluencer(id),
    ),
  },
  Mutation: {
    inviteInfluencer: requireAdmin(async (_, { input }, { invitation }) => invitation.inviteInfluencer(input)),
    updateMyInfluencerProfile: requireInfluencer(async (_, { input }, { influencer, currentAccount }) =>
      influencer.updateInfluencerProfileByUserId(currentAccount.mongodbId, input),
    ),
    updateMyInfluencerProfileAvatar: requireInfluencer(async (_, { image }, { influencer, currentAccount }) =>
      influencer.updateInfluencerProfileAvatarByUserId(currentAccount.mongodbId, image),
    ),
    updateMyInfluencerProfileFavoriteCharities: requireInfluencer(
      async (_, { charities }, { influencer, currentAccount }) =>
        influencer.updateInfluencerProfileFavoriteCharitiesByUserId(currentAccount.mongodbId, charities),
    ),
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
  InfluencerProfile: {
    userAccount: requireAdmin(
      async (influencerProfile: InfluencerProfile, _, { loaders }) =>
        (influencerProfile.userAccount && (await loaders.userAccount.getById(influencerProfile.userAccount))) ?? null,
    ),
    invitation: requireAdmin(async (influencerProfile: InfluencerProfile, _, { loaders }) =>
      loaders.invitation.getByInfluencerId(influencerProfile.id),
    ),
    favoriteCharities: requireInfluencer(async (influencerProfile: InfluencerProfile, _, { loaders }) =>
      Promise.all(influencerProfile.favoriteCharities.map((c) => loaders.charity.getById(c))),
    ),
  },
  UserAccount: {
    influencerProfile: loadAccount(
      async (userAccount: UserAccount, _, { user, currentAccount, loaders }): Promise<InfluencerProfile | null> => {
        const hasAccess = currentAccount?.isAdmin || user?.id === userAccount.id;
        if (!userAccount.mongodbId || !hasAccess) {
          return null;
        }
        return loaders.influencer.getByUserAccountId(userAccount.mongodbId);
      },
    ),
  },
};
