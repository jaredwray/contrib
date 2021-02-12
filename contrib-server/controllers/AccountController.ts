import { AccountModel, IAccount } from '../models/AccountModel';
import { Connection } from 'mongoose';
import { verifications, verificationChecks } from '../services/Twilio';
import { ApolloError } from 'apollo-server';
import { UserRoles } from '../dto/UserRoles';
import { assignRole } from '../services/RolesManager';

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
    account = await AccountModel(conn).findOne({ authzId }).exec();
    if (account != null) {
      account = account.transform();
    }
  } catch (error) {
    console.error('find account by authzId failed: ', error);
  }

  return account;
};

export const createVerification = async (phoneNumber: string): Promise<void> => {
  const verificationRequest = await verifications.create({ to: phoneNumber, channel: 'sms' });
  console.debug(verificationRequest);
};

export const confirmVerification = async (phoneNumber: string, otp: string): Promise<void> => {
  const verificationResult = await verificationChecks.create({ to: phoneNumber, code: otp });
  console.debug(verificationResult);
  if (verificationResult.status !== 'approved') {
    throw new ApolloError(`wrong confirmation code for: ${phoneNumber}`, 'phone_confirmation_exception');
  }
};

export const checkAccountAvailability = async (
  conn: Connection,
  authzId: string,
  phoneNumber: string,
): Promise<void> => {
  if (await AccountModel(conn).findOne({ authzId }).exec()) {
    throw new ApolloError('user with auth id already registered', 'auth_id_already_exists');
  }
  if (await AccountModel(conn).findOne({ phoneNumber }).exec()) {
    throw new ApolloError(`phone: ${phoneNumber} is already in use`, 'phone_reserved');
  }
};

export const createAccount = async (
  conn: Connection,
  params: { phoneNumber: string; authzId: string },
): Promise<IAccount> => {
  return await AccountModel(conn).create({ authzId: params.authzId, phoneNumber: params.phoneNumber });
};

export const assignPlainUserRole = async (authzId: string): Promise<void> => {
  return await assignRole(authzId, UserRoles.PLAIN_USER);
};
