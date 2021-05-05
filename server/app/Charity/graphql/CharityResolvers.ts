import { GraphqlContext } from '../../../graphql/GraphqlContext';
import { Charity } from '../dto/Charity';
import { requireAdmin } from '../../../graphql/middleware/requireAdmin';
import { loadAccount } from '../../../graphql/middleware/loadAccount';
import { UserAccount } from '../../UserAccount/dto/UserAccount';

type CharityInput = {
  name: string;
};

export const CharityResolvers = {
  Query: {
    charitiesSearch: async (
      parent: unknown,
      { query }: { query: string },
      { charity }: GraphqlContext,
    ): Promise<Charity[] | null> => {
      return await charity.searchForCharity(query.trim());
    },
    charities: async (
      parent: unknown,
      { size, skip }: { size: number; skip: number },
      { charity }: GraphqlContext,
    ): Promise<{ items: Charity[]; totalItems: number; size: number; skip: number }> => {
      return {
        items: await charity.listCharities(skip, size),
        totalItems: await charity.countCharities(),
        size,
        skip,
      };
    },
  },
  Mutation: {
    inviteCharity: requireAdmin(async (_, { input }, { invitation }) => invitation.inviteCharity(input)),
    updateCharity: async (
      _: unknown,
      currentInput: { input: CharityInput; id: string },
      { charity }: GraphqlContext,
    ): Promise<Charity> => {
      const { id, input } = currentInput;
      return await charity.updateCharity(id, input);
    },
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
