import { ApolloError } from 'apollo-server';
import { AccountModel, IAccount } from '../models/AccountModel';
import { Connection } from 'mongoose';

/**
 * gets account by auth id
 * @param connection database connection
 * @param id auth id
 * @returns {IAccount | null} user or null
 */
export const getAccountByAuthzId = async (conn: Connection, authzId: string): Promise<IAccount> => {
  let account: IAccount | null;

  await AccountModel(conn).findOne({ authzId }).exec();

  try {
    // account = await AccountModel(conn).findById(id);
    account = await AccountModel(conn).findOne({ authzId }).exec();
    if (account != null) {
      account = account.transform();
    }
  } catch (error) {
    console.error('> getUser error: ', error);
  }

  return account;
};

// createVerification

// confirmVerification

// checkAccountAvailability

// assignRole
