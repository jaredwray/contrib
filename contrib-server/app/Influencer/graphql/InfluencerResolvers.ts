import { requirePermission } from '../../../graphql/middleware/requirePermission';
import { UserPermission } from '../../../authz';
import { InviteInfluencerInput } from './model/InviteInfluencerInput';
import { GraphqlContext } from '../../../graphql/GraphqlContext';
import { InfluencerProfile } from '../dto/InfluencerProfile';
import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { UpdateInfluencerProfileInput } from './model/UpdateInfluencerProfileInput';

export const InfluencerResolvers = {
  Query: {
    invitation: async (parent: unknown, { slug }: { slug: string }, { invitation }: GraphqlContext) => {
      const foundInvitation = await invitation.findInvitationBySlug(slug);
      if (foundInvitation?.accepted) {
        return null;
      }
      return invitation;
    },
    influencers: requirePermission(
      UserPermission.MANAGE_INFLUENCERS,
      async (parent, { size, skip }: { size: number; skip: number }, { influencer }) => {
        return {
          items: await influencer.listInfluencers(skip, size),
          totalItems: await influencer.countInfluencers(),
          size,
          skip,
        };
      },
    ),
  },
  Mutation: {
    inviteInfluencer: requirePermission(
      UserPermission.MANAGE_INFLUENCERS,
      async (parent, { input }: { input: InviteInfluencerInput }, { invitation }) => invitation.inviteInfluencer(input),
    ),
    updateMyInfluencerProfile: requirePermission(
      UserPermission.INFLUENCER,
      async (_, { input }: { input: UpdateInfluencerProfileInput }, { user, influencer, userAccount }) => {
        const account = await userAccount.getAccountByAuthzId(user.id);
        return influencer.updateInfluencerProfileByUserId(account.mongodbId, input);
      },
    ),
  },
  InfluencerProfile: {
    userAccount: requirePermission(
      UserPermission.MANAGE_INFLUENCERS,
      async (parent: InfluencerProfile, _, { userAccountLoader }) =>
        (parent.userAccount && (await userAccountLoader.getById(parent.userAccount))) ?? null,
    ),
    invitation: requirePermission(
      UserPermission.MANAGE_INFLUENCERS,
      async (parent: InfluencerProfile, _, { invitationLoader }) => invitationLoader.getByInfluencerId(parent.id),
    ),
  },
  UserAccount: {
    influencerProfile: async (parent: UserAccount, _, { user, influencerLoader }: GraphqlContext) => {
      const hasAccess = user?.hasPermission(UserPermission.MANAGE_INFLUENCERS) || user?.id === parent.id;
      if (!parent.mongodbId || !hasAccess) {
        return null;
      }
      return influencerLoader.getByUserAccountId(parent.mongodbId);
    },
  },
};
