import { GraphQLScalarType } from 'graphql/type/definition';
import Maybe from 'graphql/tsutils/Maybe';
import { Kind } from 'graphql/language/kinds';

import { gql } from 'apollo-server-express';
import Dinero, { Dinero as IDinero, DineroObject } from 'dinero.js';

export const MoneyTypeDefs = gql`
  scalar Money
`;

export const MoneyResolver = {
  Money: new GraphQLScalarType({
    name: 'Money',
    description: 'Dinero.js money scalar type',
    parseLiteral(valueNode: any): Maybe<any> {
      if (valueNode.kind === Kind.INT) {
        return { amount: valueNode.value, currency: 'USD' };
      }
      throw new TypeError(`Node kind should be INT, instead got ${valueNode.kind}`);
    },
    parseValue(value: DineroObject): Maybe<IDinero> {
      return Dinero(value);
    },
    serialize(value: IDinero): Maybe<DineroObject> {
      return value.toJSON();
    },
  }),
};
