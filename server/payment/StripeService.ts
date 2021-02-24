import { IUserAccount } from '../app/UserAccount/mongodb/UserAccountModel';

export class StripeService {
  public chargePayment(user: IUserAccount): Promise<string> {
    return new Promise<string>((res) => {
      console.log('charged', user);
      setTimeout(() => res('NOOP'), 1000);
    });
  }
}
