import dayjs from 'dayjs';
import { ClientSession, Connection } from 'mongoose';
import Dinero, { Currency } from 'dinero.js';

import { BidModel, IBidModel } from '../mongodb/BidModel';
import { UserAccountModel } from '../../UserAccount/mongodb/UserAccountModel';
import { CreateBidInput } from '../dto/CreateBidInput';
import { Bid } from '../dto/Bid';

import { AppConfig } from '../../../config';
import { AppError } from '../../../errors/AppError';

export class BidService {
  private readonly BidModel = BidModel(this.connection);
  private readonly UserAccountModel = UserAccountModel(this.connection);

  constructor(private readonly connection: Connection) {}

  public async createBid(input: CreateBidInput, session?: ClientSession): Promise<Bid | null> {
    if (!input) {
      return null;
    }
    try {
      const { user, auction, bid, bidCurrency, paymentSource, chargeId } = input;

      const [createdBid] = await this.BidModel.create(
        [
          {
            auction,
            user,
            createdAt: dayjs(),
            paymentSource,
            bid,
            bidCurrency: (bidCurrency ?? AppConfig.app.defaultCurrency) as Currency,
            chargeId: chargeId,
          },
        ],
        { session },
      );
      return this.makeBid(createdBid);
    } catch (error) {
      throw new AppError('Can not create bid');
    }
  }

  public async getPopulatedBids(auctionId: string): Promise<IBidModel[] | []> {
    const bids = await this.BidModel.find({ auction: auctionId }).sort({ bid: 'desc' });
    if (!bids) {
      return [];
    }
    for (const bid of bids) {
      await bid.populate({ path: 'user', model: this.UserAccountModel }).execPopulate();
    }
    return bids;
  }

  public makeBid(model: IBidModel): Bid | null {
    if (!model) {
      return null;
    }
    const { paymentSource, user, bid, bidCurrency, createdAt, chargeId } = model;

    return {
      paymentSource,
      user,
      bid: Dinero({ amount: bid, currency: bidCurrency }),
      createdAt,
      chargeId,
    };
  }
}
