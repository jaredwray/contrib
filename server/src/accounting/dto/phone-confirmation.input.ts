import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class PhoneConfirmationInput {
  @Field()
  phoneNumber: string;

  @Field()
  otp: string;
}
