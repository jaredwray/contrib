import { Stripe } from 'stripe';

import { StripeService } from './StripeService';
import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { PaymentInformation } from '../dto/PaymentInformation';
import { UserAccountService } from '../../UserAccount';

export class PaymentService {
  constructor(private readonly userAccountService: UserAccountService, private readonly stripeService: StripeService) {}

  public async getAccountPaymentInformation(account: UserAccount): Promise<PaymentInformation> {
    if (!account.stripeCustomerId) {
      return null;
    }

    const card = await this.stripeService.getCustomerCard(account.stripeCustomerId);

    return PaymentService.makePaymentInformationForCard(card);
  }

  public async updateAccountPaymentInformation(
    sourceAccount: UserAccount,
    stripeSourceToken: string,
  ): Promise<UserAccount> {
    let account = sourceAccount;

    if (!account.stripeCustomerId) {
      const customer = await this.stripeService.createCustomerForAccount(account);
      account = await this.userAccountService.updateAccountStripeCustomerId(account, customer.id);
    }

    await this.stripeService.setCustomerCard(account.stripeCustomerId, stripeSourceToken);

    return sourceAccount;
  }

  public async chargeUser(
    account: UserAccount,
    paymentSource: string,
    amount: Dinero.Dinero,
    description: string,
  ): Promise<string> {
    return this.stripeService.createCharge(account.stripeCustomerId, paymentSource, amount, description);
  }

  private static makePaymentInformationForCard(card: Stripe.Card): PaymentInformation {
    if (!card) {
      return null;
    }

    return {
      id: card.id,
      cardNumberLast4: card.last4,
      cardBrand: card.brand,
      cardExpirationMonth: card.exp_month,
      cardExpirationYear: card.exp_year,
    };
  }
}
