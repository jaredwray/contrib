import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { UserAccountStatus } from '../models/user-account-status.model';

export type AccountDocument = Account & Document;

@Schema()
export class Account {
  @Prop({ required: true, index: true, unique: true })
  authzId: string;

  @Prop({ unique: true })
  phoneNumber: string;

  @Prop()
  status: UserAccountStatus;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
