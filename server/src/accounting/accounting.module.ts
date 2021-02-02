import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthzModule } from 'src/authz/authz.module';
import { LoggingModule } from 'src/logging/logging.module';
import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';
import { PhoneVerificationService } from './phone-verification.service';
import { Account, AccountSchema } from './schemas/account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    ConfigModule,
    LoggingModule,
    AuthzModule,
  ],
  providers: [AccountResolver, PhoneVerificationService, AccountService],
})
export class AccountingModule {}
