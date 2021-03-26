import Stripe from 'stripe';

import { Auth0Service } from '../../../authz';
import { AppConfig } from '../../../config';
import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { AppLogger } from '../../../logger';

export class StripeService {
  private readonly stripe = new Stripe(AppConfig.stripe.secretKey, { apiVersion: '2020-08-27' });

  public async createCustomerForAccount(account: UserAccount): Promise<Stripe.Customer> {
    const { name, email } = await new Auth0Service().getUser(account.id);

    return this.stripe.customers.create({
      phone: account.phoneNumber,
      metadata: {
        auth0: account.id,
        contrib: account.mongodbId,
        name,
        email,
      },
    });
  }

  public async getCustomerCard(customerId: string): Promise<Stripe.Card | null> {
    const maybeDeletedCustomer = await this.stripe.customers.retrieve(customerId, { expand: ['default_source'] });
    if (maybeDeletedCustomer.deleted) {
      return null;
    }

    const customer = maybeDeletedCustomer as Stripe.Customer;
    if (!customer.default_source) {
      return null;
    }

    // TODO: check source is actually a card

    return customer.default_source as Stripe.Card;
  }

  public async setCustomerCard(customerId: string, cardToken: string): Promise<Stripe.Card> {
    const card = await this.stripe.customers.createSource(customerId, { source: cardToken });
    if (card.object !== 'card') {
      AppLogger.error(`provided card token results in an object of type "${card.object}" (expected "card")`);
      return null;
    }
    await this.stripe.customers.update(customerId, { default_source: card.id });
    return card;
  }

  public async createCharge(
    customerId: string,
    paymentSource: string,
    amount: Dinero.Dinero,
    description: string,
  ): Promise<string> {
    const charge = await this.stripe.charges.create({
      customer: customerId,
      amount: amount.getAmount(),
      currency: amount.getCurrency().toLowerCase(),
      source: paymentSource,
      description,
    });
    return charge.id;
  }
}
