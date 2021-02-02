import { Field, ObjectType } from '@nestjs/graphql';
import { UserAccountStatus } from './user-account-status.model';

@ObjectType()
export class UserAccount {
  @Field({
    description: 'ID is the user_id received from Auth0.',
  })
  id?: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => UserAccountStatus, {
    description: 'Account onboarding status.',
  })
  status?: UserAccountStatus;

  @Field({
    nullable: true,
    description: 'Account verified phone number.',
  })
  phoneNumber?: string;
}
