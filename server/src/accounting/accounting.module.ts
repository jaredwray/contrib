import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthzModule } from 'src/authz/authz.module';
import { LoggingModule } from 'src/logging/logging.module';
import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';
import { Account, AccountSchema } from './schemas/account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    LoggingModule,
    AuthzModule,
  ],
  providers: [AccountResolver, AccountService],
})
export class AccountingModule {}
