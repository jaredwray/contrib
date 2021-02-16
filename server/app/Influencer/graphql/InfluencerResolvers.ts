import { requirePermission } from '../../../graphql/middleware/requirePermission';
import { UserPermission } from '../../../authz';
import { InviteInfluencerInput } from './model/InviteInfluencerInput';
import { GraphqlContext } from '../../../graphql/GraphqlContext';
import { InfluencerProfile } from '../dto/InfluencerProfile';
import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { UpdateInfluencerProfileInput } from './model/UpdateInfluencerProfileInput';
import { Invitation } from '../dto/Invitation';

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
    influencers: requirePermission(
      UserPermission.MANAGE_INFLUENCERS,
      async (
        parent,
        { size, skip }: { size: number; skip: number },
        { influencer },
      ): Promise<{ items: InfluencerProfile[]; totalItems: number; size: number; skip: number }> => {
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
      async (_: unknown, { input }: { input: UpdateInfluencerProfileInput }, { user, influencer, userAccount }) => {
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
    influencerProfile: async (
      parent: UserAccount,
      _: unknown,
      { user, influencerLoader }: GraphqlContext,
    ): Promise<InfluencerProfile | null> => {
      const hasAccess = user?.hasPermission(UserPermission.MANAGE_INFLUENCERS) || user?.id === parent.id;
      if (!parent.mongodbId || !hasAccess) {
        return null;
      }
      return influencerLoader.getByUserAccountId(parent.mongodbId);
    },
  },
};
