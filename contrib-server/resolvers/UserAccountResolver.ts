import { UserAccountQuery } from '../queries/UserAccountQuery';
import { UserAccountMutation } from '../mutations/UserAccountMutation';
import { IResolvers } from 'apollo-server';

/**
 * @description holds user account resolver
 */

export const UserAccountResolver: IResolvers = {
  Query: UserAccountQuery,
  Mutation: UserAccountMutation,
};
