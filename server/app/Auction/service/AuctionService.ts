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
import { UserAccountModel } from '../../UserAccount/mongodb/UserAccountModel';
import { AuctionAssetModel } from '../mongodb/AuctionAssetModel';
import { ICreateAuctionBidInput } from '../graphql/model/CreateAuctionBidInput';
import { AuctionBid } from '../dto/AuctionBid';
import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { AppError } from '../../../errors/AppError';
import { ErrorCode } from '../../../errors/ErrorCode';
import { StripeService } from '../../../payment/StripeService';
import { AppLogger } from '../../../logger';
import { GCloudStorage, IFile } from '../../GCloudStorage';

export class AuctionService {
  private readonly AuctionModel = AuctionModel(this.connection);
  private readonly CharityModel = CharityModel(this.connection);
  private readonly AuctionAssetModel = AuctionAssetModel(this.connection);
  private readonly AuctionBidModel = AuctionBidModel(this.connection);
  private readonly UserAccountModel = UserAccountModel(this.connection);
  private readonly attachmentsService = new AuctionAttachmentsService(this.connection, this.cloudStorage);

  constructor(
    private readonly connection: Connection,
    private readonly stripeService: StripeService,
    private readonly cloudStorage: GCloudStorage,
  ) {}

  public async createAuctionDraft(auctionOrganizerId: string, input: ICreateAuctionInput): Promise<Auction> {
    const [auction] = await this.AuctionModel.create([
      { ...input, auctionOrganizer: Types.ObjectId(auctionOrganizerId) },
    ]);
    return AuctionService.makeAuction(auction);
  }

  public async listAuctions(skip: number, size: number): Promise<Auction[]> {
    const auctions = await this.AuctionModel.find()
      .populate({ path: 'charity', model: this.CharityModel })
      .populate({ path: 'assets', model: this.attachmentsService.AuctionAsset })
      .populate({ path: 'auctionOrganizer', mode: this.UserAccountModel, select: ['_id'] })
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
      const res = await this.AuctionModel.findById(id).exec();
      await this._populateAuction(res).execPopulate();
      return res;
    } catch (e) {
      throw new AppError('Auction was not found', ErrorCode.NOT_FOUND);
    }
  }

  public async updateAuctionStatus(id: string, userId: string, status: AuctionStatus): Promise<Auction> {
    const auction = await this.AuctionModel.findOne({ _id: id, auctionOrganizer: userId }).exec();
    if (!auction) {
      throw new AppError('Auction not found', ErrorCode.NOT_FOUND);
    }
    auction.status = status;
    const updatedAuction = await auction.save();
    await this._populateAuction(updatedAuction).execPopulate();
    return AuctionService.makeAuction(updatedAuction);
  }

  private _populateAuction(model: IAuctionModel): IAuctionModel {
    return model
      .populate({ path: 'charity', model: this.CharityModel })
      .populate({ path: 'assets', model: this.attachmentsService.AuctionAsset })
      .populate({ path: 'maxBid', model: this.AuctionBidModel })
      .populate({ path: 'auctionOrganizer', model: this.UserAccountModel })
      .populate({
        path: 'bids',
        model: this.AuctionBidModel,
        populate: { path: 'user', model: this.UserAccountModel, select: ['_id'] },
      });
  }

  public async addAuctionAttachment(id: string, userId: string, attachment: Promise<IFile>): Promise<Auction> {
    const auction = await this.AuctionModel.findOne({ _id: id, auctionOrganizer: userId }).exec();
    if (!auction) {
      throw new AppError('Auction not found', ErrorCode.NOT_FOUND);
    }
    try {
      const asset = await this.attachmentsService.uploadFileAttachment(id, userId, attachment);

      auction.assets.push(asset);
      await auction.save();

      const populatedAuction = await this._populateAuction(auction).execPopulate();
      return AuctionService.makeAuction(populatedAuction);
    } catch (error) {
      throw error;
    }
  }

  public async removeAuctionAttachment(id: string, userId: string, attachmentUrl: string): Promise<Auction> {
    const auction = await this.AuctionModel.findOne({ _id: id, auctionOrganizer: userId }).exec();
    if (!auction) {
      throw new AppError('Auction not found', ErrorCode.NOT_FOUND);
    }
    try {
      await this.attachmentsService.removeFileAttachment(attachmentUrl);
      await auction.update({ $pull: { attachments: { url: attachmentUrl } } });
      const updatedAuction = await this._populateAuction(auction).execPopulate();
      return AuctionService.makeAuction(updatedAuction);
    } catch (error) {
      throw new AppError(error.message, ErrorCode.INTERNAL_ERROR);
    }
  }

  public async updateAuction(id: string, userId: string, input: IUpdateAuctionInput): Promise<Auction> {
    const auction = await this.AuctionModel.findOne({ _id: id, auctionOrganizer: userId }).exec();
    if (!auction) {
      throw new AppError('Auction not found', ErrorCode.NOT_FOUND);
    }

    const { startDate, endDate, charity, ...rest } = input;
    const isDrafted = auction.status === AuctionStatus.DRAFT;
    const charityObject = charity ? { charity: Types.ObjectId(charity) } : {};

    Object.assign(auction, {
      startsAt: isDrafted && startDate ? startDate : auction.startsAt.toISOString(),
      endsAt: isDrafted && endDate ? endDate : auction.endsAt.toISOString(),
      ...rest,
      ...charityObject,
    });
    const updatedAuction = await auction.save();
    await this._populateAuction(updatedAuction).execPopulate();
    return AuctionService.makeAuction(updatedAuction);
  }

  public async addAuctionBid(
    id: string,
    { bid, user }: ICreateAuctionBidInput & { user: UserAccount },
  ): Promise<AuctionBid> {
    const auction = await this._handleGetAuction(id);
    const appliedStatus = auction.status === AuctionStatus.DRAFT ? { status: AuctionStatus.ACTIVE } : {};

    if (dayjs().utc().isAfter(auction.endsAt)) {
      throw new AppError('Auction has already ended', ErrorCode.BAD_REQUEST);
    }
    if (auction.status !== AuctionStatus.ACTIVE) {
      throw new AppError('Auction is not active', ErrorCode.BAD_REQUEST);
    }
    const [createdBid] = await this.AuctionBidModel.create([
      {
        user: user.mongodbId,
        bid: bid.getAmount(),
        bidCurrency: bid.getCurrency(),
        createdAt: dayjs().toISOString(),
      },
    ]);
    Object.assign(auction, {
      bids: [...auction.bids, createdBid._id],
      ...appliedStatus,
    });

    await auction.save();

    return AuctionService.makeAuctionBid(createdBid);
  }

  public scheduleAuctionJob(): { message: string } {
    this.AuctionModel.find({ status: AuctionStatus.ACTIVE })
      .exec()
      .then(async (auctions) => {
        for await (const auction of auctions) {
          if (dayjs().utc().isAfter(auction.endsAt)) {
            const currentAuction = await auction
              .populate({
                path: 'maxBid',
                model: this.AuctionBidModel,
                populate: { path: 'user', model: this.UserAccountModel },
              })
              .execPopulate();
            await this.settleAuctionAndCharge(currentAuction);
          }
        }
      });
    return { message: 'Scheduled' };
  }

  public async settleAuctionAndCharge(auction: IAuctionModel): Promise<void> {
    if (!auction) {
      throw new AppError('Auction not found');
    }
    auction.status = AuctionStatus.SETTLED;

    if (auction.maxBid) {
      try {
        const result = await this.stripeService.chargePayment(auction.maxBid.user);
        AppLogger.info(`Payment charged for user ${auction.maxBid.user._id.toString()} with result ${result}`);
      } catch (e) {
        throw new AppError('Cannot charge user', ErrorCode.INTERNAL_ERROR);
      }
    }
    AppLogger.info(`Auction with id ${auction.id} has been settled`);
    await auction.save();
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
