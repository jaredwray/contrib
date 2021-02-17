import { GraphqlContext } from '../../../graphql/GraphqlContext';
import { Charity } from '../dto/Charity';

type CharityInput = {
  name: string;
};

export const CharityResolvers = {
  Query: {
    searchForCharities: async (
      parent: unknown,
      input: CharityInput,
      { charity }: GraphqlContext,
    ): Promise<Charity[] | null> => {
      return await charity.searchForCharity(input);
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
    createCharity: async (
      _: unknown,
      { input: { name } }: { input: CharityInput },
      { charity }: GraphqlContext,
    ): Promise<Charity> => {
      return await charity.createCharity({ name });
    },
    updateCharity: async (
      _: unknown,
      currentInput: { input: CharityInput; id: string },
      { charity }: GraphqlContext,
    ): Promise<Charity> => {
      const { id, input } = currentInput;
      return await charity.updateCharity(id, input);
    },
  },
};
