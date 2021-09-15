import fs from 'fs-extra';
import Handlebars from 'handlebars';
import path from 'path';
import { AppError, ErrorCode } from '../../../errors';

export interface IHandlebarsService {
  renderTemplate(currentPath: string, context: { [key: string]: any }): Promise<string>;
}

export enum MessageTemplate {
  AUCTION_DELIVERY_DETAILS_FOR_WINNER = 'auctionDeliveryDetailsForWinner.hbs',
  AUCTION_BID_OVERLAP = 'auctionBidOverlap.hbs',
  AUCTION_WON_MESSAGE = 'auctionWon.hbs',
  AUCTION_WON_MESSAGE_WITH_DELIVERY_LINK = 'auctionWonWithDeliveryLink.hbs',
  AUCTION_BOUGHT_MESSAGE = 'auctionBought.hbs',
  AUCTION_BOUGHT_MESSAGE_WITH_DELIVERY_LINK = 'auctionBoughtWithDeliveryLink.hbs',
  AUCTION_ENDS_MESSAGE_FOR_USERS = 'auctionEndsForUsers.hbs',
  AUCTION_ENDS_MESSAGE_FOR_AUCTIONORGANIZER = 'auctionEndsForAuctionOrganizer.hbs',
  AUCTION_IS_CREATED_MESSAGE = 'auctionIsCreated.hbs',
  AUCTION_IS_CREATED_MESSAGE_FOR_CHARITY_FOLLOWERS = 'auctionIsCreatedForCharityFollowers.hbs',
  AUCTION_IS_CREATED_MESSAGE_FOR_INFLUENCER_FOLLOWERS = 'auctionIsCreatedForInfluencerFollowers.hbs',
}

export class HandlebarsService implements IHandlebarsService {
  async renderTemplate(fileName: string, context?: { [key: string]: any }): Promise<string> {
    try {
      const file = await fs.readFile(path.resolve(__dirname, `../../../views/${fileName}`), { encoding: 'utf-8' });
      return Handlebars.compile(file)(context);
    } catch (e) {
      throw new AppError(`Generate handlebars template. error: ${e.message}`, ErrorCode.INTERNAL_ERROR);
    }
  }
}
