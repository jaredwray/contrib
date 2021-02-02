import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppLogger } from 'src/logging/app-logger.service';
import { PhoneConfirmationInput } from './dto/phone-confirmation.input';
import { PhoneInput } from './dto/phone.input';
import { UserAccountStatus } from './models/user-account-status.model';
import { UserAccount } from './models/user-account.model';
import { Account, AccountDocument } from './schemas/account.schema';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    private logger: AppLogger,
  ) {
    this.logger.setContext('AccountingService');
  }

  async findOneById(authId: string): Promise<UserAccount> {
    this.logger.log('finding account by Auth0 id');

    const dummy_acc: UserAccount = new UserAccount();
    dummy_acc.id = authId;
    dummy_acc.status = UserAccountStatus.PHONE_NUMBER_REQUIRED;
    return new Promise((res) => res(dummy_acc));
  }

  async sendConfirmationCode(
    authId: string,
    phoneInput: PhoneInput,
  ): Promise<UserAccount> {
    this.logger.log('generating confirmation code to verify phone number');

    const dummy_acc: UserAccount = new UserAccount();
    dummy_acc.id = authId;
    dummy_acc.phoneNumber = '+375331234567';
    dummy_acc.status = UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED;
    return new Promise((res) => res(dummy_acc));
  }

  async createAccountWithConfirmation(
    authId: string,
    phoneConfirmationInput: PhoneConfirmationInput,
  ): Promise<UserAccount> {
    this.logger.log('creating account with verified phone number');

    const dummy_acc: UserAccount = new UserAccount();
    dummy_acc.id = authId;
    dummy_acc.phoneNumber = '+375331234567';
    dummy_acc.status = UserAccountStatus.COMPLETED;
    return new Promise((res) => res(dummy_acc));
  }
}
