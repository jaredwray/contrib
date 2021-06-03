import fs from 'fs-extra';
import Handlebars from 'handlebars';
import path from 'path';
import { AppError, ErrorCode } from '../../../errors';

export interface IHandlebarsService {
  renderTemplate(currentPath: string, context: { [key: string]: any }): Promise<string>;
}

export enum MessageTemplate {
  AUCTION_BID_OVERLAP = 'auctionBidOverlap.hbs',
  AUCTION_WON_MESSAGE = 'auctionWon.hbs',
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
