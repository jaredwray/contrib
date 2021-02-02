import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class PhoneInput {
  @Field()
  phoneNumber: string;
}
