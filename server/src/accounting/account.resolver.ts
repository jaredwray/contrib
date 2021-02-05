import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/authz/auth-user';
import { CurrentUser } from 'src/authz/current-user';
import { GqlJwtAuthGuard } from 'src/authz/gql-jwt-auth.guart';
import { AllGqlExceptionFilter } from 'src/errors/all-gql-exception.filter';
import { InternalGqlExceptionFilter } from 'src/errors/internal-gql-exception.filter';
import { AccountService } from './account.service';
import { PhoneConfirmationInput } from './dto/phone-confirmation.input';
import { PhoneInput } from './dto/phone.input';
import { UserAccount } from './models/user-account.model';

@Resolver(() => UserAccount)
@UseFilters(AllGqlExceptionFilter, InternalGqlExceptionFilter)
export class AccountResolver {
  constructor(private accountService: AccountService) {}

  @Query(() => UserAccount)
  @UseGuards(GqlJwtAuthGuard)
  async myAccount(@CurrentUser() user: AuthUser): Promise<UserAccount> {
    return this.accountService.findOneById(user.sub);
  }

  @Mutation(() => UserAccount)
  @UseGuards(GqlJwtAuthGuard)
  async createAccountWithPhoneNumber(
    @CurrentUser() user: AuthUser,
    @Args('phoneInput') phoneInput: PhoneInput,
  ): Promise<UserAccount> {
    return this.accountService.sendConfirmationCode(user.sub, phoneInput);
  }

  @Mutation(() => UserAccount)
  @UseGuards(GqlJwtAuthGuard)
  async confirmAccountWithPhoneNumber(
    @CurrentUser() user: AuthUser,
    @Args('phoneConfirmationInput')
    phoneConfirmationInput: PhoneConfirmationInput,
  ): Promise<UserAccount> {
    return this.accountService.createAccountWithConfirmation(user.sub, phoneConfirmationInput);
  }
}
