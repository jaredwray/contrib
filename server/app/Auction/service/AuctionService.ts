import { Connection, Types } from 'mongoose';
import dayjs from 'dayjs';
import Dinero, { Currency } from 'dinero.js';

import { AuctionModel, IAuctionBid, IAuctionModel } from '../mongodb/AuctionModel';
import { IAuctionAssetModel } from '../mongodb/AuctionAssetModel';
import { AuctionAttachmentsService } from './AuctionAttachmentsService';
import { UserAccountModel } from '../../UserAccount/mongodb/UserAccountModel';

import { AuctionStatus } from '../dto/AuctionStatus';
import { Auction } from '../dto/Auction';
import { AuctionAssets } from '../dto/AuctionAssets';
import { AuctionBid } from '../dto/AuctionBid';
import { UserAccount } from '../../UserAccount/dto/UserAccount';

import { AuctionInput } from '../graphql/model/AuctionInput';
import { GCloudStorage, IFile } from '../../GCloudStorage';
import { ICreateAuctionBidInput } from '../graphql/model/CreateAuctionBidInput';

import { CloudflareStreaming } from '../../CloudflareStreaming';
import { InfluencerService } from '../../Influencer';

import { AppError, ErrorCode } from '../../../errors';
import { AppLogger } from '../../../logger';

import { AuctionRepository } from '../repository/AuctionRepository';
import { IAuctionFilters, IAuctionRepository } from '../repository/IAuctionRepoository';
import { PaymentService } from '../../Payment';
import { AppConfig } from '../../../config';
import { UrlShortenerService } from '../../Core';

export class AuctionService {
  private readonly AuctionModel = AuctionModel(this.connection);
  private readonly UserAccountModel = UserAccountModel(this.connection);
  private readonly attachmentsService = new AuctionAttachmentsService(this.connection, this.cloudStorage);
  private readonly auctionRepository: IAuctionRepository = new AuctionRepository(this.connection);

  constructor(
    private readonly connection: Connection,
    private readonly paymentService: PaymentService,
    private readonly cloudStorage: GCloudStorage,
    private readonly urlShortenerService: UrlShortenerService,
  ) {}

  public async createAuctionDraft(auctionOrganizerId: string, input: AuctionInput): Promise<Auction> {
    let auction = await this.auctionRepository.createAuction(auctionOrganizerId, input);
    auction = await this.auctionRepository.updateAuctionLink(auction._id, await this.makeShortAuctionLink(auction._id));
    return this.makeAuction(auction);
  }

  public async listAuctions(
    params: IAuctionFilters,
  ): Promise<{ items: Auction[]; totalItems: number; size: number; skip: number }> {
    const items = await this.auctionRepository.getAuctions(params);
    const totalItems = await this.auctionRepository.getAuctionsCount(params);

    return {
      totalItems,
      items: items.map((item) => this.makeAuction(item)),
      size: items.length,
      skip: params.skip || 0,
    };
  }

  public async listSports(): Promise<string[]> {
    return this.auctionRepository.getAuctionSports();
  }

  public async getAuctionPriceLimits(): Promise<{ min: Dinero.Dinero; max: Dinero.Dinero }> {
    const { min, max } = await this.auctionRepository.getAuctionPriceLimits();
    return {
      min: Dinero({ amount: min, currency: 'USD' }),
      max: Dinero({ amount: max, currency: 'USD' }),
    };
  }

  public async getAuction(id: string): Promise<Auction> {
    const auction = await this.auctionRepository.getAuction(id);
    return this.makeAuction(auction);
  }

  public async updateAuctionStatus(id: string, userId: string, status: AuctionStatus): Promise<Auction> {
    const auction = await this.auctionRepository.changeAuctionStatus(id, userId, status);
    return this.makeAuction(auction);
  }

  public async addAuctionAttachment(id: string, userId: string, attachment: Promise<IFile>): Promise<AuctionAssets> {
    const auction = await this.auctionRepository.getAuction(id, userId);
    if (auction?.status !== AuctionStatus.DRAFT) {
      throw new AppError('Auction does not exist or cannot be edited', ErrorCode.NOT_FOUND);
    }

    try {
      const asset = await this.attachmentsService.uploadFileAttachment(id, userId, attachment);
      const { filename } = await attachment;

      await this.AuctionModel.updateOne({ _id: id }, { $addToSet: { assets: asset } });

      return AuctionService.makeAuctionAttachment(asset, filename);
    } catch (error) {
      throw error;
    }
  }

  public async removeAuctionAttachment(id: string, userId: string, attachmentUrl: string): Promise<AuctionAssets> {
    const auction = await this.auctionRepository.getAuction(id, userId);
    if (!auction) {
      throw new AppError('Auction not found', ErrorCode.NOT_FOUND);
    }
    try {
      const attachment = await this.attachmentsService.AuctionAsset.findOne({ url: attachmentUrl });
      await auction.update({ $pull: { assets: attachment._id } });
      await attachment.remove();
      await this.attachmentsService.removeFileAttachment(attachmentUrl);

      return AuctionService.makeAuctionAttachment(attachment);
    } catch (error) {
      throw new AppError(error.message, ErrorCode.INTERNAL_ERROR);
    }
  }

  public async updateAuction(id: string, userId: string, input: AuctionInput): Promise<Auction> {
    const {
      title,
      startDate,
      endDate,
      charity,
      startPrice,
      description,
      fullPageDescription,
      playedIn,
      sport,
      fairMarketValue,
      ...rest
    } = input;
    const auction = await this.auctionRepository.updateAuction(id, userId, {
      ...(title ? { title: title.trim() } : {}),
      ...(startDate ? { startsAt: startDate } : {}),
      ...(endDate ? { endsAt: endDate } : {}),
      ...(startPrice
        ? {
            startPrice: startPrice.getAmount(),
            currentPrice: startPrice.getAmount(),
            startPriceCurrency: startPrice.getCurrency(),
            currentPriceCurrency: startPrice.getCurrency(),
          }
        : {}),
      ...(fairMarketValue
        ? {
            fairMarketValue: fairMarketValue.getAmount(),
            fairMarketValueCurrency: fairMarketValue.getCurrency(),
          }
        : {}),
      ...(charity ? { charity: Types.ObjectId(charity) } : {}),
      ...(description ? { description: description.trim() } : {}),
      ...(fullPageDescription ? { fullPageDescription: fullPageDescription.trim() } : {}),
      ...(sport ? { sport: sport.trim() } : {}),
      ...(playedIn ? { playedIn: playedIn.trim() } : {}),
      ...rest,
    });

    return this.makeAuction(auction);
  }

  public async addAuctionBid(
    id: string,
    { bid, user }: ICreateAuctionBidInput & { user: UserAccount },
  ): Promise<AuctionBid> {
    const session = await this.connection.startSession();
    session.startTransaction();

    const card = await this.paymentService.getAccountPaymentInformation(user);
    if (!card) {
      throw new AppError('Payment method is not provided');
    }

    const auction = await this.AuctionModel.findById(id, null, { session }).exec();

    if (auction.status !== AuctionStatus.ACTIVE) {
      throw new AppError('Auction is not active', ErrorCode.BAD_REQUEST);
    }

    if (dayjs().utc().isAfter(auction.endsAt)) {
      throw new AppError('Auction has already ended', ErrorCode.BAD_REQUEST);
    }

    const currentPrice = Dinero({
      amount: auction.currentPrice,
      currency: auction.currentPriceCurrency as Currency,
    });

    if (bid.lessThanOrEqual(currentPrice)) {
      throw new AppError(
        'Provided bid is lower, than maximum bid that was encountered on the auction',
        ErrorCode.BAD_REQUEST,
      );
    }

    const createdBid = {
      user: user.mongodbId,
      createdAt: dayjs(),
      paymentSource: card.id,
      bid: bid.getAmount(),
      bidCurrency: bid.getCurrency(),
      chargeId: null,
    };

    Object.assign(auction, {
      bids: [...auction.bids, createdBid],
    });

    auction.currentPrice = bid.getAmount();

    await auction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return AuctionService.makeAuctionBid(createdBid);
  }

  public scheduleAuctionJob(): { message: string } {
    this.AuctionModel.find({ status: AuctionStatus.ACTIVE })
      .exec()
      .then(async (auctions) => {
        for await (const auction of auctions) {
          if (dayjs().utc().isAfter(auction.endsAt)) {
            const currentAuction = await auction
              .populate({ path: 'bids.user', model: this.UserAccountModel })
              .execPopulate();
            await this.settleAuctionAndCharge(currentAuction);
          }
        }
      });
    return { message: 'Scheduled' };
  }

  public async getInfluencersAuctions(id: string): Promise<Auction[]> {
    const auctions = await this.auctionRepository.getInfluencersAuctions(id);
    return auctions.map((auction) => this.makeAuction(auction));
  }

  public async settleAuctionAndCharge(auction: IAuctionModel): Promise<void> {
    if (!auction) {
      throw new AppError('Auction not found');
    }
    auction.status = AuctionStatus.SETTLED;
    const maxBids: IAuctionBid[] = auction.bids.sort((curr, next) => {
      return Number(curr.bidMoney.lessThan(next.bidMoney));
    });
    for await (const bid of maxBids) {
      try {
        bid.chargeId = await this.paymentService.chargeUser(
          bid.user,
          bid.paymentSource,
          bid.bidMoney,
          `Contrib auction: ${auction.title}`,
        );
        AppLogger.info(`Auction with id ${auction.id} has been settled`);
        await auction.save();
        return;
      } catch (error) {
        AppLogger.error(`Unable to charge user ${bid.user.id.toString()}, with error: ${error.message}`);
      }
    }
    AppLogger.error(
      `Unable to charge any user for the auction ${auction.id.toString()}, moving auction to the FAILED status`,
    );
    auction.status = AuctionStatus.FAILED;
    await auction.save();
    return;
  }

  private static makeAuctionBid(model: IAuctionBid): AuctionBid | null {
    if (!model) {
      return null;
    }
    return {
      user: model.user?._id?.toString(),
      bid: model.bidMoney || Dinero({ amount: model.bid, currency: model.bidCurrency }),
      createdAt: model.createdAt,
    };
  }

  private static makeAuctionAttachment(model: IAuctionAssetModel, fileName?: string): AuctionAssets | null {
    if (!model) {
      return null;
    }
    const { url, type, uid } = model;

    return {
      id: model._id.toString(),
      type,
      url,
      cloudflareUrl: model.uid ? CloudflareStreaming.getVideoStreamUrl(model.uid) : null,
      thumbnail: model.uid ? CloudflareStreaming.getVideoPreviewUrl(model.uid) : null,
      uid,
      originalFileName: fileName,
    };
  }

  public makeAuction(model: IAuctionModel): Auction | null {
    if (!model) {
      return null;
    }

    const {
      _id,
      startsAt,
      endsAt,
      charity,
      assets,
      bids,
      currentPrice,
      startPrice,
      auctionOrganizer,
      startPriceCurrency,
      currentPriceCurrency,
      fairMarketValue,
      fairMarketValueCurrency,
      link: rawLink,
      ...rest
    } = model.toObject();

    if (!auctionOrganizer) {
      AppLogger.error('auction is missing organizer', {
        auctionData: JSON.stringify(model.toObject()),
      });
      return null;
    }

    // temporal: some older auctions won't have a pre-populated link in dev environment
    // one day we'll clear our dev database, and this line can removed then
    const link = rawLink || this.makeLongAuctionLink(_id.toString());

    return {
      id: _id.toString(),
      attachments: assets
        .map((asset) => AuctionService.makeAuctionAttachment(asset))
        .sort((a: any, b: any) => {
          if (b.type > a.type) return -1;
        }),
      endDate: endsAt,
      startDate: startsAt,
      charity: charity
        ? {
            id: charity._id,
            name: charity.name,
            status: charity.status,
            profileStatus: charity.profileStatus,
            stripeStatus: charity.stripeStatus,
            userAccount: charity.userAccount,
            stripeAccountId: charity.stripeAccountId,
            avatarUrl: charity.avatarUrl,
            profileDescription: charity.profileDescription,
            websiteUrl: charity.websiteUrl,
            website: charity.website,
            totalRaisedAmount: charity.totalRaisedAmount,
          }
        : null,
      bids: bids?.map(AuctionService.makeAuctionBid) || [],
      totalBids: bids?.length ?? 0,
      currentPrice: Dinero({ currency: currentPriceCurrency as Dinero.Currency, amount: currentPrice }),
      startPrice: Dinero({ currency: startPriceCurrency as Dinero.Currency, amount: startPrice }),
      fairMarketValue: fairMarketValue
        ? Dinero({ currency: fairMarketValueCurrency as Dinero.Currency, amount: fairMarketValue })
        : null,
      auctionOrganizer: InfluencerService.makeInfluencerProfile(auctionOrganizer),
      link,
      ...rest,
    };
  }

  public static makeTotalRaisedAmount(auctions: IAuctionModel[]): Dinero.Dinero {
    if (!auctions) {
      return Dinero({ amount: 0, currency: 'USD' });
    }
    return auctions
      .map((a) =>
        Dinero({ amount: a.currentPrice ?? 0, currency: (a.currentPriceCurrency as Dinero.Currency) ?? 'USD' }),
      )
      .reduce((total, next) => total.add(next), Dinero({ amount: 0, currency: 'USD' }));
  }

  private makeLongAuctionLink(id: string) {
    const url = new URL(AppConfig.app.url);
    url.pathname = `/auctions/${id}`;
    return url.toString();
  }

  private async makeShortAuctionLink(id: string) {
    return this.urlShortenerService.shortenUrl(this.makeLongAuctionLink(id));
  }
}
