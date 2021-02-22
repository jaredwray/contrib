import { Connection, Types } from 'mongoose';
import * as dayjs from 'dayjs';
import * as Dinero from 'dinero.js';

import { AuctionModel, IAuctionModel } from '../mongodb/AuctionModel';
import { AuctionAttachmentsService } from './AuctionAttachmentsService';
import { AuctionStatus } from '../dto/AuctionStatus';
import { Auction } from '../dto/Auction';
import { ICreateAuctionInput } from '../graphql/model/CreateAuctionInput';
import { IUpdateAuctionInput } from '../graphql/model/UpdateAuctionInput';
import { CharityModel } from '../../Charity/mongodb/CharityModel';
import { AuctionBidModel, IAuctionBidModel } from '../mongodb/AuctionBidModel';
import { IUserAccount, UserAccountModel } from '../../UserAccount/mongodb/UserAccountModel';
import { ICreateAuctionBidInput } from '../graphql/model/CreateAuctionBidInput';
import { AuctionBid } from '../dto/AuctionBid';
import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { AppError } from '../../../errors/AppError';
import { ErrorCode } from '../../../errors/ErrorCode';
import { StripeService } from '../../../payment/StripeService';

export class AuctionService {
  private readonly AuctionModel = AuctionModel(this.connection);
  private readonly CharityModel = CharityModel(this.connection);
  private readonly AuctionBidModel = AuctionBidModel(this.connection);
  private readonly UserAccountModel = UserAccountModel(this.connection);

  private readonly attachmentsService = new AuctionAttachmentsService(this.connection);
  constructor(private readonly connection: Connection, private readonly stripeService: StripeService) {}

  public async createAuctionDraft(input: ICreateAuctionInput): Promise<Auction> {
    const [auction] = await this.AuctionModel.create([input]);
    return AuctionService.makeAuction(auction);
  }

  public async listAuctions(skip: number, size: number): Promise<Auction[]> {
    const auctions = await this.AuctionModel.find()
      .populate({ path: 'charity', model: this.CharityModel })
      .populate({ path: 'assets', model: this.attachmentsService.AuctionAsset })
      .populate({
        path: 'bids',
        model: this.AuctionBidModel,
        populate: { path: 'user', model: this.UserAccountModel, select: ['_id'] },
      })
      .populate({ path: 'maxBid', model: this.AuctionBidModel })
      .skip(skip)
      .limit(size)
      .sort({ id: 'asc' })
      .exec();
    return auctions.map(AuctionService.makeAuction);
  }

  public async getAuction(id: string): Promise<Auction> {
    const auction = await this._handleGetAuction(id);
    return AuctionService.makeAuction(auction);
  }

  private async _handleGetAuction(id: string): Promise<IAuctionModel> {
    try {
      return await this.AuctionModel.findById(id)
        .populate({ path: 'charity', model: this.CharityModel })
        .populate({ path: 'assets', model: this.attachmentsService.AuctionAsset })
        .populate({
          path: 'bids',
          model: this.AuctionBidModel,
          populate: { path: 'user', model: this.UserAccountModel, select: ['_id'] },
        })
        .populate({ path: 'maxBid', model: this.AuctionBidModel })
        .exec();
    } catch (e) {
      throw new AppError('Auction not found', ErrorCode.BAD_REQUEST);
    }
  }

  public async updateAuctionStatus(id: string, status: AuctionStatus): Promise<Auction> {
    const auction = await this._handleGetAuction(id);
    auction.status = status;
    await auction.save();
    return AuctionService.makeAuction(auction);
  }

  private _populateAuction(model: IAuctionModel): IAuctionModel {
    return model
      .populate({ path: 'charity', model: this.CharityModel })
      .populate({ path: 'assets', model: this.attachmentsService.AuctionAsset })
      .populate({ path: 'maxBid', model: this.AuctionBidModel })
      .populate({
        path: 'bids',
        model: this.AuctionBidModel,
        populate: { path: 'user', model: this.UserAccountModel, select: ['_id'] },
      });
  }

  public async updateAuction(id: string, input: IUpdateAuctionInput): Promise<Auction> {
    const auction = await this._handleGetAuction(id);
    const isDrafted = auction.status === AuctionStatus.DRAFT && !auction.bids.length;
    const { startDate, endDate, charity, ...rest } = input;
    const charityObject = charity ? { charity: Types.ObjectId(charity) } : {};

    Object.assign(auction, {
      startsAt: isDrafted && startDate ? startDate : auction.startsAt.toISOString(),
      endsAt: isDrafted && endDate ? endDate : auction.endsAt.toISOString(),
      ...rest,
      ...charityObject,
    });
    await (await this._populateAuction(auction).save()).execPopulate();
    return AuctionService.makeAuction(auction);
  }

  public async addAuctionBid(
    id: string,
    { bid, user }: ICreateAuctionBidInput & { user: UserAccount },
  ): Promise<AuctionBid> {
    const auction = await this._handleGetAuction(id);
    const appliedStatus = auction.status === AuctionStatus.DRAFT ? { status: AuctionStatus.ACTIVE } : {};

    const [createdBid] = await this.AuctionBidModel.create([
      {
        user: user.mongodbId,
        bid: bid.getAmount(),
        bidCurrency: bid.getCurrency(),
        createdAt: dayjs().toISOString(),
      },
    ]);
    if (auction.status == AuctionStatus.SETTLED || dayjs().utc().isAfter(auction.endsAt)) {
      throw new AppError('Auction is already settled', ErrorCode.BAD_REQUEST);
    }
    Object.assign(auction, {
      bids: [...auction.bids, createdBid._id],
      ...appliedStatus,
    });

    await auction.save();

    return AuctionService.makeAuctionBid(createdBid);
  }

  public async settleAuctionAndExec(id: string): Promise<Auction> {
    const auction = await this.AuctionModel.findById(id)
      .populate({
        path: 'maxBid',
        model: this.AuctionBidModel,
        populate: { path: 'user', model: this.UserAccountModel },
      })
      .exec();
    if (!auction) {
      throw new AppError('Auction not found');
    }
    await this.stripeService.chargePayment();
    auction.status = AuctionStatus.SETTLED;
    const result = await auction.save();
    return AuctionService.makeAuction(result);
  }

  private static makeAuctionBid(model: IAuctionBidModel): AuctionBid | null {
    if (!model) {
      return null;
    }
    return {
      id: model._id.toString(),
      user: model.user._id.toString(),
      bid: model.bidMoney || Dinero({ amount: model.bid, currency: model.bidCurrency }),
      createdAt: model.createdAt,
    };
  }

  private static makeAuction(model: IAuctionModel): Auction | null {
    if (!model) {
      return null;
    }
    const { _id, startsAt, endsAt, charity, assets, bids, maxBid, ...rest } = model.toObject();

    return {
      id: _id.toString(),
      attachments: assets,
      maxBid: AuctionService.makeAuctionBid(maxBid),
      endDate: endsAt,
      startDate: startsAt,
      charity: charity ? { id: charity?._id, name: charity.name } : null,
      bids: bids?.map(AuctionService.makeAuctionBid) || [],
      ...rest,
    };
  }
}
