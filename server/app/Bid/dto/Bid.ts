import { IUserAccount } from '../../UserAccount/mongodb/UserAccountModel';
import { Dayjs } from 'dayjs';

export interface Bid {
  user: IUserAccount['_id'];
  bid: Dinero.Dinero;
  paymentSource: string;
  createdAt: Dayjs;
  chargeId: string;
}
