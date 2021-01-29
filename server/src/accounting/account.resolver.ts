import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { PhoneConfirmationInput } from './dto/phone-confirmation.input';
import { PhoneInput } from './dto/phone.input';
import { UserAccount } from './models/user-account.model';

@Resolver(() => UserAccount)
export class AccountResolver {
  constructor(private accountService: AccountService) {}

  // TODO: replace with fetch by id from guard
  @Query(() => UserAccount)
  async myAccount(): Promise<UserAccount> {
    const id = 'fetched account id';
    return this.accountService.findOneById(id);
  }

  @Mutation(() => UserAccount)
  async createAccountWithPhoneNumber(
    @Args('phoneInput') phoneInput: PhoneInput,
  ): Promise<UserAccount> {
    const id = 'fetched account id';
    return this.accountService.sendConfirmationCode(id, phoneInput);
  }

  @Mutation(() => UserAccount)
  async confirmAccountWithPhoneNumber(
    @Args('phoneConfirmationInput')
    phoneConfirmationInput: PhoneConfirmationInput,
  ): Promise<UserAccount> {
    const id = 'fetched account id';
    return this.accountService.createAccountWithConfirmation(
      id,
      phoneConfirmationInput,
    );
  }
}
