import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggingModule } from 'src/logging/logging.module';
import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';
import { Account, AccountSchema } from './schemas/account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    LoggingModule,
  ],
  providers: [AccountResolver, AccountService],
})
export class AccountingModule {}
