import { ShortLink } from '../dto/ShortLink';

import { GraphqlResolver } from '../../../graphql/types';

interface ShortLinkType {
  Query: {
    getLink: GraphqlResolver<ShortLink | null, { slug: string }>;
  };
}

export const ShortLinkResolvers: ShortLinkType = {
  Query: {
    getLink: async (_, { slug }, { shortLinkService }) => await shortLinkService.getLink(slug),
  },
};
