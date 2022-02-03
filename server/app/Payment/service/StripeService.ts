import Dinero from 'dinero.js';
import Stripe from 'stripe';

import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { UserAccountAddress } from '../../UserAccount/dto/UserAccountAddress';

import { AppConfig, requireEnvVar } from '../../../config';
import { AppLogger } from '../../../logger';
import { AppError } from '../../../errors';

export class StripeService {
  private readonly stripe = new Stripe(AppConfig.stripe.secretKey, { apiVersion: '2020-08-27' });

  public async createStripeAccount(): Promise<Stripe.Account> {
    return await this.stripe.accounts.create({
      type: 'express',
      capabilities: {
        transfers: { requested: true },
        card_payments: { requested: true },
      },
    });
  }

  public async createStripeObjLink(stripeAccountId: string, charityId: string): Promise<Stripe.AccountLink> {
    return this.stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: requireEnvVar('APP_URL'),
      return_url: this.stripeReturnURL(charityId),
      type: 'account_onboarding',
    });
  }

  private stripeReturnURL(charityId: string): string {
    const appURL = new URL(AppConfig.app.url);

    if (!AppConfig.environment.serveClient) {
      appURL.port = AppConfig.app.port.toString();
    }

    return `${appURL.toString()}api/v1/account_onboarding/?user_id=${charityId}`;
  }

  public constructEvent(body: string | Buffer, signature: string): any {
    return this.stripe.webhooks.constructEvent(body, signature, AppConfig.stripe.webhookSecretKey);
  }

  public async createCustomerForAccount(account: UserAccount, name: string, email: string): Promise<Stripe.Customer> {
    return this.stripe.customers.create({
      phone: account.phoneNumber,
      name,
      email,
      metadata: {
        auth: account.id,
        contrib: account.mongodbId,
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

  public async updateStripeCustomerAddress(customerId: string, addressData: UserAccountAddress): Promise<void> {
    if (!customerId) return;

    if (!addressData || !Object.keys(addressData).length) {
      AppLogger.error(`Can not update customer address info for customer #${customerId}. No address info`);
      return;
    }

    const { state, city, zipCode, street } = addressData;

    try {
      await this.stripe.customers.update(customerId, {
        address: { city, state, postal_code: zipCode.toString(), line1: street, country: 'US' },
      });
    } catch (error) {
      AppLogger.error(`Can not update customer address info for customer #${customerId}: ${error.message}`);
    }
  }

  public async createCharge(
    customerId: string,
    paymentSource: string,
    amount: Dinero.Dinero,
    description?: string,
    charityStripeId?: string,
    charityId?: string,
  ): Promise<string> {
    const transferGroup = `CHARGE_FOR_CHARITY_${charityId}`;
    const contribSharePercentage = parseInt(AppConfig.stripe.contribSharePercentage);

    const basicChargeOptions = {
      customer: customerId,
      amount: amount.getAmount(),
      currency: amount.getCurrency().toLowerCase(),
      payment_method: paymentSource,
      payment_method_types: ['card'],
      description,
      off_session: true,
      confirm: true,
    };

    const chargeOptions = {
      ...(charityStripeId
        ? {
            ...basicChargeOptions,
            transfer_group: transferGroup,
            application_fee_amount: Math.round((amount.getAmount() * contribSharePercentage) / 100),
            on_behalf_of: charityStripeId,
            transfer_data: {
              destination: charityStripeId,
            },
          }
        : { ...basicChargeOptions }),
    };

    const charge = await this.stripe.paymentIntents.create({ ...chargeOptions });
    return charge.id;
  }

  public async getCustomerInformation(stripeCustomerId: string): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
    return await this.stripe.customers.retrieve(stripeCustomerId);
  }
}
