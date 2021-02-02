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
  constructor(@InjectModel(Account.name) private accountModel: Model<AccountDocument>, private logger: AppLogger) {
    this.logger.setContext('AccountingService');
  }

  async findOneById(authzId: string): Promise<UserAccount> {
    const account = await this.accountModel.findOne({ authzId }).exec();
    return AccountService.makeAccountDto(authzId, account);
  }

  async sendConfirmationCode(authzId: string, { phoneNumber }: PhoneInput): Promise<UserAccount> {
    const account = await this.accountModel.findOne({ authzId }).exec();
    if (account) {
      this.logger.warn(`attempting to re-send confirmation code for account ${authzId}`);
      return AccountService.makeAccountDto(authzId, account);
    }

    // TODO: actually send confirmation code
    this.logger.log(`... mocking sending an otp to ${phoneNumber}`);

    const responseDto: UserAccount = new UserAccount();
    responseDto.id = authzId;
    responseDto.phoneNumber = phoneNumber;
    responseDto.status = UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED;
    return responseDto;
  }

  async createAccountWithConfirmation(
    authzId: string,
    { phoneNumber, otp }: PhoneConfirmationInput,
  ): Promise<UserAccount> {
    const account = await this.accountModel.findOne({ authzId }).exec();
    if (account) {
      this.logger.warn(`attempting to confirm otp code for account ${authzId}`);
      return AccountService.makeAccountDto(authzId, account);
    }

    // TODO: actually confirm the code
    this.logger.log(`... mocking otp confirmation with ${phoneNumber} and code ${otp}`);

    const newAccount = await this.accountModel.create({
      authzId,
      phoneNumber,
      status: UserAccountStatus.COMPLETED,
    });

    return AccountService.makeAccountDto(authzId, newAccount);
  }

  private static makeAccountDto(authzId: string, account: Account): UserAccount {
    const accountDto = new UserAccount();
    accountDto.id = authzId;
    accountDto.phoneNumber = account?.phoneNumber || null;
    accountDto.status = account?.status || UserAccountStatus.PHONE_NUMBER_REQUIRED;
    return accountDto;
  }
}
