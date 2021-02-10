import { ApolloError } from 'apollo-server';
import { AccountModel, IAccount } from '../models/AccountModel';
import { Connection } from 'mongoose';

/**
 * gets account by auth id
 * @param connection database connection
 * @param id auth id
 * @returns {IAccount | null} user or null
 */
export const getAccount = async (connection: Connection, id: string): Promise<IAccount> => {
  let account: IAccount | null;

  try {
    account = await AccountModel(connection).findById(id);
    if (account != null) {
      account = account.transform();
    }
  } catch (error) {
    console.error('> getUser error: ', error);
    throw new ApolloError('Error retrieving user with id: ' + id);
  }

  return account;
};

// createVerification

// confirmVerification

// checkAccountAvailability

// assignRole
