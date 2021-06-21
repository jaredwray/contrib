import { GraphQLScalarType } from 'graphql/type/definition';
import { Kind } from 'graphql/language/kinds';

import { AppConfig } from '../../config';
import { gql } from 'apollo-server-express';
import Dinero from 'dinero.js';

export const MoneyTypeDefs = gql`
  scalar Money
`;

export const MoneyResolver = {
  Money: new GraphQLScalarType({
    name: 'Money',
    description: 'Dinero.js money scalar type',
    parseLiteral(valueNode: any): Dinero.Dinero | null {
      if (valueNode.kind === Kind.INT) {
        return Dinero({
          amount: parseInt(valueNode.value, 10),
          currency: AppConfig.app.defaultCurrency as Dinero.Currency,
        });
      }
      return null;
    },
    parseValue(value: Dinero.DineroObject): Dinero.Dinero | null {
      if (value) {
        return Dinero(value);
      }
      return null;
    },
    serialize(value: Dinero.Dinero): Dinero.DineroObject | null {
      if (!value) {
        return null;
      }
      return value.toJSON();
    },
  }),
};
