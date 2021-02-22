import { GraphQLScalarType } from 'graphql/type/definition';
import Maybe from 'graphql/tsutils/Maybe';
import { Kind } from 'graphql/language/kinds';

import { gql } from 'apollo-server-express';
import * as Dinero from 'dinero.js';

export const MoneyTypeDefs = gql`
  scalar Money
`;

export const MoneyResolver = {
  Money: new GraphQLScalarType({
    name: 'Money',
    description: 'Dinero.js money scalar type',
    parseLiteral(valueNode: any): Maybe<any> {
      if (valueNode.kind === Kind.INT) {
        return Dinero({ amount: parseInt(valueNode.value, 10), currency: 'USD' });
      }
      return null;
    },
    parseValue(value: Dinero.DineroObject): Maybe<Dinero.Dinero> {
      if (value) {
        return Dinero(value);
      }
      return null;
    },
    serialize(value: Dinero.Dinero): Maybe<Dinero.DineroObject> {
      if (!value) {
        return null;
      }
      return value.toJSON();
    },
  }),
};
