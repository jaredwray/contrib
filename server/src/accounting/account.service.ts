import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RolesManager } from 'src/authz/roles-manager';
import { UserRoles } from 'src/authz/user-roles';
import { BaseError } from 'src/errors/base-error';
import { AppLogger } from 'src/logging/app-logger.service';
import { PhoneConfirmationInput } from './dto/phone-confirmation.input';
import { PhoneInput } from './dto/phone.input';
import { UserAccountStatus } from './models/user-account-status.model';
import { UserAccount } from './models/user-account.model';
import { PhoneVerificationService } from './phone-verification.service';
import { Account, AccountDocument } from './schemas/account.schema';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    private logger: AppLogger,
    private phoneVerificationService: PhoneVerificationService,
    private rolesManager: RolesManager,
  ) {
    this.logger.setContext('AccountingService');
  }

  async findOneById(authzId: string): Promise<UserAccount> {
    const acc: AccountDocument = await this.accountModel.findOne({ authzId }).exec();

    return UserAccount.build({
      id: authzId,
      phoneNumber: acc?.phoneNumber || null,
      status: acc?.status || UserAccountStatus.PHONE_NUMBER_REQUIRED,
    });
  }

  async sendConfirmationCode(authzId: string, { phoneNumber }: PhoneInput): Promise<UserAccount> {
    await this.phoneVerificationService.createVerification(phoneNumber);

    return UserAccount.build({
      id: authzId,
      phoneNumber: phoneNumber,
      status: UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED,
    });
  }

  async createAccountWithConfirmation(
    authzId: string,
    { phoneNumber, otp }: PhoneConfirmationInput,
  ): Promise<UserAccount> {
    await this.checkAccountAvailability(authzId, phoneNumber);
    await this.phoneVerificationService.confirmVerification(phoneNumber, otp);
    const newAcc = await this.accountModel.create({ authzId, phoneNumber, status: UserAccountStatus.COMPLETED });
    await this.rolesManager.assignRole(authzId, UserRoles.PLAIN_USER);

    return UserAccount.build({
      id: newAcc.authzId,
      phoneNumber: newAcc.phoneNumber,
      status: newAcc.status,
    });
  }

  private async checkAccountAvailability(authzId: string, phoneNumber: string) {
    if (await this.accountModel.exists({ authzId })) {
      throw new BaseError('Account already exists');
    }
    if (await this.accountModel.exists({ phoneNumber })) {
      throw new BaseError('${phoneNumber} is already in use');
    }
  }
}
