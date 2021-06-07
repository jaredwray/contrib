import { Dinero } from 'dinero.js';
import { Stripe } from 'stripe';

import { StripeService } from './StripeService';
import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { PaymentInformation } from '../dto/PaymentInformation';
import { UserAccountService } from '../../UserAccount';
import { Auth0Service } from '../../../authz';

export class PaymentService {
  constructor(
    private readonly userAccountService: UserAccountService,
    private readonly stripeService: StripeService,
    private readonly auth0Service: Auth0Service,
  ) {}

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
      const { name, email } = await this.auth0Service.getUser(account.id);
      const customer = await this.stripeService.createCustomerForAccount(account, name, email);
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
    charityStripeId: string,
    charityId: string,
  ): Promise<string> {
    return this.stripeService.createCharge(
      account.stripeCustomerId,
      paymentSource,
      amount,
      description,
      charityStripeId,
      charityId,
    );
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
