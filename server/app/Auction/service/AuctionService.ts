import { Connection, Types } from 'mongoose';
import { AuctionModel, IAuctionModel } from '../mongodb/AuctionModel';
import { AuctionAttachmentsService } from './AuctionAttachmentsService';
import { AuctionStatus } from '../dto/AuctionStatus';
import { Auction } from '../dto/Auction';
import { ICreateAuctionInput } from '../graphql/model/CreateAuctionInput';
import { IUpdateAuctionInput } from '../graphql/model/UpdateAuctionInput';
import { CharityModel } from '../../Charity/mongodb/CharityModel';
import { AuctionBidModel } from '../mongodb/AuctionBidModel';

export class AuctionService {
  private readonly AuctionModel = AuctionModel(this.connection);
  private readonly CharityModel = CharityModel(this.connection);
  private readonly AuctionBid = AuctionBidModel(this.connection);

  private readonly attachmentsService = new AuctionAttachmentsService(this.connection);
  constructor(private readonly connection: Connection) {}

  public async createAuctionDraft(input: ICreateAuctionInput): Promise<Auction> {
    const [auction] = await this.AuctionModel.create([input]);
    return AuctionService.makeAuction(auction);
  }

  public async listAuctions(skip: number, size: number): Promise<Auction[]> {
    const auctions = await this.AuctionModel.find()
      .populate({ path: 'charity', model: this.CharityModel })
      .populate({ path: 'assets', model: this.attachmentsService.AuctionAsset })
      .populate({ path: 'bids', model: this.AuctionBid })
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
    const auction = await this.AuctionModel.findById(id).populate('charity').exec();
    if (!auction) {
      throw new Error(`auction record not found`);
    }
    return auction;
  }

  public async updateAuctionStatus(id: string, status: AuctionStatus): Promise<Auction> {
    const auction = await this._handleGetAuction(id);
    auction.status = status;
    await auction.save();
    return AuctionService.makeAuction(auction);
  }

  public async updateAuction(id: string, input: IUpdateAuctionInput): Promise<Auction> {
    const auction = await this._handleGetAuction(id);
    const isDrafted = auction.status === AuctionStatus.DRAFT && !auction.bids.length;
    const { startDate, endDate, charity, ...rest } = input;
    const charityObject = charity ? { charity: Types.ObjectId(charity) } : {};
    Object.assign(auction, {
      startsAt: (isDrafted && startDate) ?? auction.startsAt,
      endsAt: (isDrafted && endDate) ?? auction.endsAt,
      ...rest,
      ...charityObject,
    });
    await (
      await auction
        .populate({ path: 'charity', model: this.CharityModel })
        .populate({ path: 'assets', model: this.attachmentsService.AuctionAsset })
        .populate({ path: 'bids', model: this.AuctionBid })
        .save()
    ).execPopulate();
    return AuctionService.makeAuction(auction);
  }

  private static makeAuction(model: IAuctionModel): Auction | null {
    const { _id, startsAt, endsAt, charity, assets, ...rest } = model.toObject();
    if (!model) {
      return null;
    }
    return {
      id: _id.toString(),
      attachments: assets,
      endDate: endsAt,
      startDate: startsAt,
      maxBid: undefined,
      charity: charity ? { id: charity?._id, name: charity.name } : null,
      ...rest,
    };
  }
}
