import { IAppGqlContext } from 'context';
import { IUserAccount, UserAccountStatus } from '../dto/UserAccount';
import { PhoneInput } from '../dto/PhoneInput';
import { PhoneConfirmationInput } from '../dto/PhoneConfirmationInput';
import {
  createVerification,
  confirmVerification,
  checkAccountAvailability,
  createAccount,
  assignPlainUserRole,
} from '../controllers/AccountController';
/**
 * @description holds user account mutations
 */

export const UserAccountMutation = {
  createAccountWithPhoneNumber: {
    resolve: async (
      parent: unknown,
      args: { phoneInput: PhoneInput },
      context: IAppGqlContext,
      info: unknown,
    ): Promise<IUserAccount> => {
      await createVerification(args.phoneInput.phoneNumber);

      return <IUserAccount>{
        id: context.authUser.sub,
        phoneNumber: args.phoneInput.phoneNumber,
        status: UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED,
      };
    },
  },
  confirmAccountWithPhoneNumber: {
    resolve: async (
      parent: unknown,
      args: { phoneConfirmationInput: PhoneConfirmationInput },
      context: IAppGqlContext,
      info: unknown,
    ): Promise<IUserAccount> => {
      const { phoneNumber, otp } = args.phoneConfirmationInput;
      const authzId = context.authUser.sub;
      await confirmVerification(phoneNumber, otp);
      await checkAccountAvailability(context.dbConn, phoneNumber, authzId);
      const newAcc = await createAccount(context.dbConn, { phoneNumber, authzId: authzId });
      await assignPlainUserRole(authzId);

      return <IUserAccount>{
        id: authzId,
        phoneNumber: newAcc.phoneNumber,
        status: UserAccountStatus.COMPLETED,
      };
    },
  },
};
