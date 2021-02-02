export enum UserAccountStatus {
  PHONE_NUMBER_REQUIRED = 'PHONE_NUMBER_REQUIRED',
  PHONE_NUMBER_CONFIRMATION_REQUIRED = 'PHONE_NUMBER_CONFIRMATION_REQUIRED',
  COMPLETED = 'COMPLETED',
}

export interface UserAccount {
  id: string;
  phoneNumber: string | null;
  status: UserAccountStatus;
}
