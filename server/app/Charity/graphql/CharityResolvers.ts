import { GraphqlContext } from '../../../graphql/GraphqlContext';
import { Charity } from '../dto/Charity';
import { requireAdmin } from '../../../graphql/middleware/requireAdmin';
import { loadAccount } from '../../../graphql/middleware/loadAccount';
import { loadCharity } from '../../../graphql/middleware/loadCharity';
import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { requireCharityOrAdmin } from '../../../graphql/middleware/requireCharityOrAdmin';
import { requireAuthenticated } from '../../../graphql/middleware/requireAuthenticated';
import { AppError, ErrorCode } from '../../../errors';
import { CharityStatus } from '../../Charity/dto/CharityStatus';

type CharityInput = {
  name: string;
};
export const CharityResolvers = {
  Query: {
    charity: loadCharity(async (_, { id }, { charity, currentCharityId }) => {
      const profileId = id === 'me' ? currentCharityId : id;
      return await charity.findCharity(profileId);
    }),
    charitiesList: async (_, { params }, { charity }) => await charity.charitiesList(params),
    topCharity: async (_, {}, { charity }) => await charity.topCharity(),
  },
  Mutation: {
    unfollowCharity: requireAuthenticated(async (_, { charityId }, { charity, currentAccount }) =>
      charity.unfollowCharity(charityId, currentAccount.mongodbId),
    ),
    followCharity: requireAuthenticated(async (_, { charityId }, { charity, currentAccount }) =>
      charity.followCharity(charityId, currentAccount.mongodbId),
    ),
    inviteCharity: requireAdmin(async (_, { input }, { invitation }) => invitation.inviteCharity(input)),
    updateCharity: async (
      _: unknown,
      currentInput: { input: CharityInput; id: string },
      { charity }: GraphqlContext,
    ): Promise<Charity> => {
      const { id, input } = currentInput;
      return await charity.updateCharity(id, input);
    },
    updateCharityProfile: requireCharityOrAdmin(
      async (_, { charityId, input }, { charity, currentAccount, currentCharityId }) => {
        const profileId = charityId === 'me' ? currentCharityId : charityId;
        if (!currentAccount.isAdmin && profileId !== currentCharityId) {
          throw new AppError('Forbidden', ErrorCode.FORBIDDEN);
        }
        return charity.updateCharityProfileById(profileId, input);
      },
    ),
    updateCharityProfileAvatar: requireCharityOrAdmin(
      async (_, { charityId, image }, { charity, currentAccount, currentCharityId }) => {
        const profileId = charityId === 'me' ? currentCharityId : charityId;
        if (!currentAccount.isAdmin && profileId !== currentCharityId) {
          throw new AppError('Forbidden', ErrorCode.FORBIDDEN);
        }
        return charity.updateCharityProfileAvatarById(profileId, image);
      },
    ),
  },
  UserAccount: {
    charity: loadAccount(
      async (userAccount: UserAccount, _, { user, currentAccount, loaders }): Promise<Charity | null> => {
        const hasAccess = currentAccount?.isAdmin || user?.id === userAccount.id;
        if (!userAccount.mongodbId || !hasAccess) {
          return null;
        }
        return await loaders.charity.getByUserAccountId(userAccount.mongodbId);
      },
    ),
  },
};
