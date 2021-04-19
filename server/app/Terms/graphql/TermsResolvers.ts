import { TermsList } from '../dto/TermsList';
import { AppError, ErrorCode } from '../../../errors';
import { GraphqlResolver } from '../../../graphql/types';
import { GraphqlContext } from '../../../graphql/GraphqlContext';

interface TermsResolversType {
  Query: {
    terms: GraphqlResolver<TermsList>;
  };
  Mutation: {};
}

export const TermsResolvers: TermsResolversType = {
  Query: {
    terms: (parent, args, { terms }) => terms.listTerms(),
  },
  Mutation: {},
};
