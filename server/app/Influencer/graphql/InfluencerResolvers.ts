import { requirePermission } from '../../../graphql/middleware/requirePermission';
import { UserPermission } from '../../../authz';
import { InviteInfluencerInput } from './model/InviteInfluencerInput';
import { GraphqlContext } from '../../../graphql/GraphqlContext';
import { InfluencerProfile } from '../dto/InfluencerProfile';
import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { UpdateInfluencerProfileInput } from './model/UpdateInfluencerProfileInput';
import { Invitation } from '../dto/Invitation';
import { requireAuthenticated } from '../../../graphql/middleware/requireAuthenticated';
import { AppError } from '../../../errors/AppError';
import { ErrorCode } from '../../../errors/ErrorCode';
import { CharityModel } from '../../Charity/mongodb/CharityModel';

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
    updateMyInfluencerProfileAvatar: requirePermission(
      UserPermission.INFLUENCER,
      async (_: unknown, { image }: { image: any }, { user, influencer, userAccount }) => {
        const account = await userAccount.getAccountByAuthzId(user.id);
        return influencer.updateInfluencerProfileAvatarByUserId(account.mongodbId, image);
      },
    ),
    updateMyInfluencerProfileFavoriteCharities: requirePermission(
      UserPermission.INFLUENCER,
      async (_: unknown, { charities }: { charities: [string] }, { user, influencer, userAccount }) => {
        const account = await userAccount.getAccountByAuthzId(user.id);
        return influencer.updateInfluencerProfileFavoriteCharitiesByUserId(account.mongodbId, charities);
      },
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
    userAccount: requirePermission(
      UserPermission.MANAGE_INFLUENCERS,
      async (parent: InfluencerProfile, _, { loaders }) =>
        (parent.userAccount && (await loaders.userAccount.getById(parent.userAccount))) ?? null,
    ),
    invitation: requirePermission(
      UserPermission.MANAGE_INFLUENCERS,
      async (parent: InfluencerProfile, _, { loaders }) => loaders.invitation.getByInfluencerId(parent.id),
    ),
    favoriteCharities: requirePermission(
      UserPermission.INFLUENCER,
      async (parent: InfluencerProfile, _, { loaders }) => await loaders.charity.getByIds(parent.favoriteCharities),
    ),
  },
  UserAccount: {
    influencerProfile: async (
      parent: UserAccount,
      _: unknown,
      { user, loaders }: GraphqlContext,
    ): Promise<InfluencerProfile | null> => {
      const hasAccess = user?.hasPermission(UserPermission.MANAGE_INFLUENCERS) || user?.id === parent.id;
      if (!parent.mongodbId || !hasAccess) {
        return null;
      }
      return loaders.influencer.getByUserAccountId(parent.mongodbId);
    },
  },
};
