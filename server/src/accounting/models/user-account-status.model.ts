import { registerEnumType } from '@nestjs/graphql';

export enum UserAccountStatus {
  PHONE_NUMBER_REQUIRED = 'PHONE_NUMBER_REQUIRED',
  PHONE_NUMBER_CONFIRMATION_REQUIRED = 'PHONE_NUMBER_CONFIRMATION_REQUIRED',
  COMPLETED = 'COMPLETED',
}

registerEnumType(UserAccountStatus, {
  name: 'UserAccountStatus',
  description: 'The supported user account statuses.',
  valuesMap: {
    PHONE_NUMBER_REQUIRED: {
      description: 'Account have no attached phone number.',
    },
    PHONE_NUMBER_CONFIRMATION_REQUIRED: {
      description: 'Account provided with a phone but not confirmed.',
    },
    COMPLETED: {
      description: 'Account have verified phone number.',
    },
  },
});
