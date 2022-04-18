import fs from 'fs-extra';
import Handlebars from 'handlebars';
import path from 'path';

import { AppError, ErrorCode } from '../errors';
import { AppLogger } from '../logger';
import { AppConfig } from '../config';
import { CloudTaskService } from './CloudTaskService';

export enum MessageTemplate {
  AUCTION_DELIVERY_DETAILS_FOR_WINNER = 'auction-delivery-details-for-winner',
  AUCTION_DELIVERY_DETAILS_FOR_ORGANIZER = 'auction-delivery-details-for-organizer',
  AUCTION_BID_OVERLAP = 'auction-bid-overlap',
  AUCTION_WON_MESSAGE = 'auction-won',
  AUCTION_WON_MESSAGE_WITH_DELIVERY_LINK = 'auction-won-with-delivery-link',
  AUCTION_BOUGHT_MESSAGE = 'auction-bought',
  AUCTION_BOUGHT_MESSAGE_WITH_DELIVERY_LINK = 'auction-bought-with-delivery-link',
  AUCTION_ENDS_MESSAGE_FOR_USERS = 'auction-ends-for-users',
  AUCTION_ENDS_MESSAGE_FOR_AUCTIONORGANIZER = 'auction-ends-for-auction-organizer',
  AUCTION_IS_CREATED_MESSAGE = 'new-auction-created',
  AUCTION_IS_CREATED_MESSAGE_FOR_CHARITY_FOLLOWERS = 'new-auction-created-for-charity-followers',
  AUCTION_IS_CREATED_MESSAGE_FOR_INFLUENCER_FOLLOWERS = 'new-auction-created-for-influencer-followers',
  PHONE_NUMBER_CHANGED = 'phone-number-changed',
  INVITED = 'invited',
}

export class NotificationService {
  constructor(private readonly cloudTaskService: CloudTaskService) {}
  private readonly airhorn = require(`${
    AppConfig.environment.isLocal ? '..' : '/usr/src/app/server'
  }/node_modules/airhorn/dist/src/airhorn`);
  private readonly airhornProviderTypes = require(`${
    AppConfig.environment.isLocal ? '..' : '/usr/src/app/server'
  }/node_modules/airhorn/dist/src/provider-type`);
  private readonly airhornClient = new this.airhorn.Airhorn({
    TEMPLATE_PATH: `${__dirname}/../templates`,
    TWILIO_SMS_ACCOUNT_SID: AppConfig.twilio.accountSid,
    TWILIO_SMS_AUTH_TOKEN: AppConfig.twilio.authToken,
  });

  async sendMessageNow(phoneNumber: string, template: string, context: object): Promise<void> {
    try {
      const result = await this.airhornClient.send(
        phoneNumber,
        AppConfig.twilio.senderNumber,
        template,
        this.airhornProviderTypes.ProviderType.SMS,
        context,
      );

      let message;

      try {
        message = await this.renderMessage(template, context);
        AppLogger.debug(`sent notification to ${phoneNumber}:\n${message}`);
      } catch (error) {}

      if (!result) {
        AppLogger.error(`Cannot send the notification to ${phoneNumber}: ${message}`);
      }
    } catch (error) {
      AppLogger.error(`Cannot send the notification to ${phoneNumber}: ${error.message}`);
    }
  }

  async sendMessageLater(
    phoneNumber: string,
    template: MessageTemplate,
    context?: { [key: string]: any },
  ): Promise<void> {
    if (AppConfig.environment.isLocal) return this.sendMessageNow(phoneNumber, template, context);

    await this.cloudTaskService.createTask(this.cloudTaskService.target('notificationTaskTargetURL'), {
      phoneNumber,
      template,
      context,
    });
  }

  private async renderMessage(template: string, context: { [key: string]: any }): Promise<string> {
    const file = await fs.readFile(path.resolve(__dirname, `../templates/${template}/sms.hbs`), { encoding: 'utf-8' });
    return Handlebars.compile(file)(context);
  }
}
