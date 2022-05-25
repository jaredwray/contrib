import dayjs from 'dayjs';
import { ClientSession, Connection } from 'mongoose';
import Dinero, { Currency } from 'dinero.js';

import { AuctionService } from '../../Auction/service/AuctionService';
import { BidModel, IBidModel } from '../mongodb/BidModel';
import { IUserAccount, UserAccountModel } from '../../UserAccount/mongodb/UserAccountModel';
import { UserAccountForBid } from '../../UserAccount/dto/UserAccountForBid';

import { AuctionModel } from '../../Auction/mongodb/AuctionModel';
import { CreateBidInput } from '../dto/CreateBidInput';
import { Bid } from '../dto/Bid';
import { BidsPage, BidsPageParams } from '../dto/BidsPage';

import { AppConfig } from '../../../config';
import { AppError } from '../../../errors/AppError';

export class BidService {
  private readonly BidModel = BidModel(this.connection);
  private readonly UserAccountModel = UserAccountModel(this.connection);
  private readonly AuctionModel = AuctionModel(this.connection);

  constructor(private readonly connection: Connection) {}

  public async createBid(input: CreateBidInput, session?: ClientSession): Promise<Bid | null> {
    if (!input) return null;

    const { bidCurrency, ...rest } = input;
    const [createdBid] = await this.BidModel.create(
      [
        {
          createdAt: this.timeNow(),
          bidCurrency: (bidCurrency ?? AppConfig.app.defaultCurrency) as Currency,
          ...rest,
        },
      ],
      { session },
    );

    return this.makeBid(createdBid);
  }

  public async bids(auctionId: string): Promise<Bid[] | []> {
    const bids = await this.BidModel.find({ auction: auctionId }).sort({ bid: 'asc' });
    return bids.map((bid) => this.makeBid(bid));
  }

  public async populatedBids(auctionId: string): Promise<Bid[] | []> {
    const bids = await this.BidModel.find({ auction: auctionId })
      .sort({ bid: 'desc' })
      .populate({ path: 'user', model: this.UserAccountModel });

    return bids.map((bid) => this.makeBid(bid));
  }

  public async userBids(userId: string, params: BidsPageParams): Promise<BidsPage> {
    const skip = params.skip || 0;
    const size = params.size || 100;

    const bids = await this.BidModel.find({ user: userId })
      .sort({ createdAt: 'desc' })
      .populate({ path: 'auction', model: this.AuctionModel })
      .limit(size)
      .skip(skip);
    const totalItems = await this.BidModel.find({ user: userId }).countDocuments();

    return {
      items: bids.map((bid) => this.makeBid(bid)),
      totalItems,
      skip,
      size,
    };
  }

  private timeNow = () => dayjs().second(0);

  private makeUser(model: IUserAccount): UserAccountForBid {
    const { authzId, _id, ...rest } = 'toObject' in model ? model.toObject() : model;

    return {
      id: authzId,
      mongodbId: model._id.toString(),
      ...rest,
    };
  }

  private makeBid(model: IBidModel): Bid | null {
    if (!model) return null;

    const { bid, user, auction, bidCurrency, ...rest } = 'toObject' in model ? model.toObject() : model;

    return {
      bid: Dinero({ amount: bid, currency: bidCurrency as Currency }),
      user: this.makeUser(user),
      auction: auction.constructor.name === 'ObjectId' ? auction : AuctionService.makeAuction(auction),
      ...rest,
    };
  }
}
