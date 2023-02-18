import { Dayjs } from 'dayjs';
import { Invitation } from '../../Invitation/dto/Invitation';
import { InviteInput } from '../../Invitation/dto/InviteInput';
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
import { CreateInfluencerInput } from '../dto/CreateInfluencerInput';
import { requireAuthenticated } from '../../../graphql/middleware/requireAuthenticated';
import { InfluencerSearchParams } from '../dto/InfluencerSearchParams';

interface InfluencerResolversType {
  Query: {
    influencer: GraphqlResolver<InfluencerProfile, { id: string }>;
    influencersList: GraphqlResolver<
      { items: InfluencerProfile[]; totalItems: number; size: number; skip: number },
      { params: InfluencerSearchParams }
    >;
    myInfluencers: GraphqlResolver<
      { items: InfluencerProfile[]; totalItems: number; size: number; skip: number },
      { params: InfluencerSearchParams }
    >;
    topEarnedInfluencer: GraphqlResolver<InfluencerProfile, {}>;
  };
  Mutation: {
    createInfluencer: GraphqlResolver<InfluencerProfile, { input: CreateInfluencerInput }>;
    updateInfluencerProfile: GraphqlResolver<
      InfluencerProfile,
      { influencerId: string; input: UpdateInfluencerProfileInput }
    >;
    updateInfluencerProfileAvatar: GraphqlResolver<InfluencerProfile, { influencerId: string; image: File }>;
    updateInfluencerProfileFavoriteCharities: GraphqlResolver<
      InfluencerProfile,
      { influencerId: string; charities: [string] }
    >;
    followInfluencer: GraphqlResolver<{ user: string; createdAt: Dayjs }, { influencerId: string }>;
    unfollowInfluencer: GraphqlResolver<{ id: string }, { influencerId: string }>;
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
    influencer: loadRole(async (_, { id }, { currentAccount, influencerService, currentAssistant }) => {
      if (id !== 'me' || !currentAccount) return influencerService.find({ _id: id });
      if (currentAssistant) return influencerService.find({ _id: currentAssistant.influencerId });

      return influencerService.find({ userAccount: currentAccount.mongodbId });
    }),
    influencersList: async (_, { params }, { influencerService }) => influencerService.influencersList(params),
    myInfluencers: loadRole(async (_, { params }, { currentAccount, influencerService, currentAssistant }) => {
      if (!currentAssistant) throw new AppError('Forbidden', ErrorCode.FORBIDDEN);

      return influencerService.influencersList({
        ...params,
        filters: {
          ...params.filters,
          assistantId: currentAssistant.id,
        },
      });
    }),
    topEarnedInfluencer: async (_, {}, { influencerService }) => influencerService.topEarned(),
  },
  Mutation: {
    unfollowInfluencer: requireAuthenticated(async (_, { influencerId }, { influencerService, currentAccount }) =>
      influencerService.unfollowInfluencer(influencerId, currentAccount.mongodbId),
    ),
    followInfluencer: requireAuthenticated(async (_, { influencerId }, { influencerService, currentAccount }) =>
      influencerService.followInfluencer(influencerId, currentAccount.mongodbId),
    ),
    createInfluencer: requireAdmin(async (_, { input }, { influencerService }) =>
      influencerService.createTransientInfluencer(input),
    ),
    updateInfluencerProfile: requireRole(
      async (
        _,
        { influencerId, input },
        { influencerService, currentAccount, currentInfluencerId, currentInfluencerIds },
      ) => {
        const profileId = influencerId === 'me' ? currentInfluencerId : influencerId;
        if (!currentAccount.isAdmin && !currentInfluencerIds.includes(profileId))
          throw new AppError('Forbidden', ErrorCode.FORBIDDEN);

        return influencerService.updateById(profileId, input);
      },
    ),
    updateInfluencerProfileAvatar: requireRole(
      async (
        _,
        { influencerId, image },
        { influencerService, currentAccount, currentInfluencerId, currentInfluencerIds },
      ) => {
        const profileId = influencerId === 'me' ? currentInfluencerId : influencerId;
        if (!currentAccount.isAdmin && !currentInfluencerIds.includes(profileId))
          throw new AppError('Forbidden', ErrorCode.FORBIDDEN);

        return influencerService.updateAvatarById(profileId, image);
      },
    ),

    updateInfluencerProfileFavoriteCharities: requireRole(
      async (
        _,
        { influencerId, charities },
        { influencerService, currentAccount, currentInfluencerId, currentInfluencerIds },
      ) => {
        const profileId = influencerId === 'me' ? currentInfluencerId : influencerId;
        if (!currentAccount.isAdmin && !currentInfluencerIds.includes(profileId))
          throw new AppError('Forbidden', ErrorCode.FORBIDDEN);

        return influencerService.updateFavoriteCharitiesById(profileId, charities);
      },
    ),
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
        if (!userAccount.mongodbId || !hasAccess) return null;

        return loaders.influencer.getByUserAccountId(userAccount.mongodbId);
      },
    ),
  },
};
