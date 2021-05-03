import { Invitation } from '../../Invitation/dto/Invitation';
import { InviteInput } from '../../Invitation/graphql/model/InviteInput';
import { InfluencerProfile } from '../dto/InfluencerProfile';
import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { UpdateInfluencerProfileInput } from './model/UpdateInfluencerProfileInput';
import { AppError, ErrorCode } from '../../../errors';
import { requireAdmin } from '../../../graphql/middleware/requireAdmin';
import { requireInfluencer } from '../../../graphql/middleware/requireInfluencer';
import { loadAccount } from '../../../graphql/middleware/loadAccount';
import { loadRole } from '../../../graphql/middleware/loadRole';
import { requireRole } from '../../../graphql/middleware/requireRole';
import { GraphqlResolver } from '../../../graphql/types';
import { Charity } from '../../Charity/dto/Charity';
import { Assistant } from '../../Assistant/dto/Assistant';
import { CreateInfluencerInput } from '../../Invitation/graphql/model/CreateInfluencerInput';

interface InfluencerResolversType {
  Query: {
    influencers: GraphqlResolver<
      { items: InfluencerProfile[]; totalItems: number; size: number; skip: number },
      { size: number; skip: number }
    >;
    influencer: GraphqlResolver<InfluencerProfile, { id: string }>;
  };
  Mutation: {
    createInfluencer: GraphqlResolver<InfluencerProfile, { input: CreateInfluencerInput }>;
    inviteInfluencer: GraphqlResolver<InfluencerProfile, { input: InviteInput }>;
    updateInfluencerProfile: GraphqlResolver<
      InfluencerProfile,
      { influencerId: string; input: UpdateInfluencerProfileInput }
    >;
    updateInfluencerProfileAvatar: GraphqlResolver<InfluencerProfile, { influencerId: string; image: File }>;
    updateInfluencerProfileFavoriteCharities: GraphqlResolver<
      InfluencerProfile,
      { influencerId: string; charities: [string] }
    >;
    updateMyInfluencerProfile: GraphqlResolver<InfluencerProfile, { input: UpdateInfluencerProfileInput }>;
    updateMyInfluencerProfileAvatar: GraphqlResolver<InfluencerProfile, { image: File }>;
    updateMyInfluencerProfileFavoriteCharities: GraphqlResolver<InfluencerProfile, { charities: [string] }>;
  };
  InfluencerProfile: {
    userAccount: GraphqlResolver<UserAccount, Record<string, never>, InfluencerProfile>;
    invitation: GraphqlResolver<Invitation, Record<string, never>, InfluencerProfile>;
    favoriteCharities: GraphqlResolver<Charity[], Record<string, never>, InfluencerProfile>;
    assistants: GraphqlResolver<Assistant[], Record<string, never>, InfluencerProfile>;
  };
  UserAccount: {
    influencerProfile: GraphqlResolver<InfluencerProfile, Record<string, never>, UserAccount>;
  };
}

export const InfluencerResolvers: InfluencerResolversType = {
  Query: {
    influencers: requireAdmin(async (_, { size, skip }, { influencer }) => ({
      items: await influencer.listInfluencers(skip, size),
      totalItems: await influencer.countInfluencers(),
      size,
      skip,
    })),
    influencer: loadRole(async (_, { id }, { currentAccount, influencer, currentAssistant }) => {
      if (id === 'me' && currentAccount) {
        if (currentAssistant) {
          return influencer.findInfluencer(currentAssistant.influencerId);
        } else {
          return influencer.findInfluencerByUserAccount(currentAccount.mongodbId);
        }
      } else {
        return influencer.findInfluencer(id);
      }
    }),
  },
  Mutation: {
    createInfluencer: requireAdmin(async (_, { input }, { influencer }) => influencer.createTransientInfluencer(input)),
    inviteInfluencer: requireAdmin(async (_, { input }, { invitation }) => invitation.inviteInfluencer(input)),
    updateInfluencerProfile: requireRole(
      async (_, { influencerId, input }, { influencer, currentAccount, currentInfluencerId }) => {
        const profileId = influencerId === 'me' ? currentInfluencerId : influencerId;
        if (!currentAccount.isAdmin && profileId !== currentInfluencerId) {
          throw new AppError('Forbidden', ErrorCode.FORBIDDEN);
        }

        return influencer.updateInfluencerProfileById(profileId, input);
      },
    ),
    updateInfluencerProfileAvatar: requireRole(
      async (_, { influencerId, image }, { influencer, currentAccount, currentInfluencerId }) => {
        const profileId = influencerId === 'me' ? currentInfluencerId : influencerId;
        if (!currentAccount.isAdmin && profileId !== currentInfluencerId) {
          throw new AppError('Forbidden', ErrorCode.FORBIDDEN);
        }

        return influencer.updateInfluencerProfileAvatarById(profileId, image);
      },
    ),

    updateInfluencerProfileFavoriteCharities: requireRole(
      async (_, { influencerId, charities }, { influencer, currentAccount, currentInfluencerId }) => {
        const profileId = influencerId === 'me' ? currentInfluencerId : influencerId;
        if (!currentAccount.isAdmin && profileId !== currentInfluencerId) {
          throw new AppError('Forbidden', ErrorCode.FORBIDDEN);
        }

        return influencer.updateInfluencerProfileFavoriteCharitiesById(profileId, charities);
      },
    ),
    /* TODO it should be removed after new API integration */
    /* TODO block start */
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
    /* TODO block end */
  },
  InfluencerProfile: {
    userAccount: requireAdmin(
      async (influencerProfile: InfluencerProfile, _, { loaders }) =>
        (influencerProfile.userAccount && (await loaders.userAccount.getById(influencerProfile.userAccount))) ?? null,
    ),
    invitation: requireAdmin(async (influencerProfile: InfluencerProfile, _, { loaders }) =>
      loaders.invitation.getByParentEntityId(influencerProfile.id),
    ),
    favoriteCharities: requireRole(
      async (influencerProfile: InfluencerProfile, _, { loaders }) =>
        await Promise.all(influencerProfile.favoriteCharities.map(async (c) => await loaders.charity.getById(c))),
    ),
    assistants: requireRole(async (influencerProfile: InfluencerProfile, _, { loaders }) =>
      Promise.all(influencerProfile.assistants.map((a) => loaders.assistant.getById(a))),
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
