import { PaymentService } from '../../../Payment';
import { PaymentInformation } from '../../../Payment/dto/PaymentInformation';
import { UserAccount } from '../../../UserAccount/dto/UserAccount';

export class TestPaymentService extends PaymentService {
  public async getAccountPaymentInformation(account: UserAccount): Promise<PaymentInformation> {
    if (!account.stripeCustomerId) {
      throw new Error('Error, cant create card');
    }
    return {
      id: '' + Date.now(),
      cardNumberLast4: '4242',
      cardBrand: 'Brand',
      cardExpirationMonth: 4,
      cardExpirationYear: 21,
    };
  }

  public async chargeUser(
    account: UserAccount,
    paymentSource: string,
    amount: Dinero.Dinero,
    description: string,
  ): Promise<string> {
    return '' + Date.now();
  }
}
