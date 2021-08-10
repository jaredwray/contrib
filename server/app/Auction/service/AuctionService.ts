import { Connection, Types, ClientSession } from 'mongoose';
import dayjs, { Dayjs } from 'dayjs';
import Dinero, { Currency } from 'dinero.js';

import { AuctionModel, IAuctionModel } from '../mongodb/AuctionModel';
import { AuctionMetricModel, IAuctionMetricModel } from '../mongodb/AuctionMetricModel';
import { AuctionAssetModel, IAuctionAssetModel } from '../mongodb/AuctionAssetModel';
import { AuctionAttachmentsService } from './AuctionAttachmentsService';
import { UserAccountModel } from '../../UserAccount/mongodb/UserAccountModel';

import { AuctionStatus } from '../dto/AuctionStatus';
import { Auction } from '../dto/Auction';
import { AuctionAssets } from '../dto/AuctionAssets';
import { AuctionParcel } from '../dto/AuctionParcel';
import { Bid } from '../../Bid/dto/Bid';
import { AuctionMetrics, BitlyClick } from '../dto/AuctionMetrics';
import { UserAccount } from '../../UserAccount/dto/UserAccount';

import { BidService } from '../../Bid/service/BidService';
import { BidModel, IBidModel } from '../../Bid/mongodb/BidModel';

import { AuctionInput } from '../graphql/model/AuctionInput';
import { GCloudStorage, IFile } from '../../GCloudStorage';
import { ICreateAuctionBidInput } from '../graphql/model/CreateAuctionBidInput';

import { CloudflareStreaming } from '../../CloudflareStreaming';
import { InfluencerService } from '../../Influencer';
import { CharityService } from '../../Charity';

import { AppError, ErrorCode } from '../../../errors';
import { AppLogger } from '../../../logger';
import { makeClicksByDay } from '../../../helpers/makeClicksByDay';
import { fullBitlyClicks } from '../../../helpers/fullBitlyClicks';
import { concatMetrics } from '../../../helpers/concatMetrics';

import { AuctionRepository } from '../repository/AuctionRepository';
import { IAuctionFilters, IAuctionRepository } from '../repository/IAuctionRepoository';
import { PaymentService, StripeService } from '../../Payment';
import { AppConfig } from '../../../config';
import { UrlShortenerService } from '../../Core';
import { CloudTaskService } from '../../CloudTaskService';
import { HandlebarsService, MessageTemplate } from '../../Message/service/HandlebarsService';
import { CharityModel } from '../../Charity/mongodb/CharityModel';
import Stripe from 'stripe';
import { objectTrimmer } from '../../../helpers/objectTrimmer';

export class AuctionService {
  private readonly AuctionModel = AuctionModel(this.connection);
  private readonly AuctionMetricModel = AuctionMetricModel(this.connection);
  private readonly UserAccountModel = UserAccountModel(this.connection);
  private readonly CharityModel = CharityModel(this.connection);
  private readonly BidModel = BidModel(this.connection);
  private readonly AssetModel = AuctionAssetModel(this.connection);
  private readonly attachmentsService = new AuctionAttachmentsService(this.connection, this.cloudStorage);
  private readonly auctionRepository: IAuctionRepository = new AuctionRepository(this.connection);

  constructor(
    private readonly connection: Connection,
    private readonly paymentService: PaymentService,
    private readonly cloudStorage: GCloudStorage,
    private readonly urlShortenerService: UrlShortenerService,
    private readonly cloudTaskService: CloudTaskService,
    private readonly handlebarsService: HandlebarsService,
    private readonly bidService: BidService,
    private readonly stripeService: StripeService,
  ) {}

  //TODO: delete after auctions winner update.
  public async updateAuctionsWinner() {
    try {
      const auctions = await this.AuctionModel.find({
        status: { $in: [AuctionStatus.SOLD, AuctionStatus.SETTLED] },
        winner: { $exists: false },
      });
      for (const auction of auctions) {
        const [lastAuctionBid] = await this.BidModel.find({ auction: auction._id }).sort({ bid: -1 }).limit(1);

        Object.assign(auction, {
          winner: lastAuctionBid.user,
        });

        await auction.save();
      }
    } catch (error) {
      AppLogger.warn(`Unable to update auction winner: ${error.message}`);
    }
  }

  //TODO: delete after auctions parcel update.
  public async updateAuctionsParcelAttributes() {
    try {
      const auctions = await this.AuctionModel.find({ parcel: { $exists: false } });
      for (const auction of auctions) {
        Object.assign(auction, {
          parcel: {
            width: AppConfig.delivery.auctionParcel.width,
            length: AppConfig.delivery.auctionParcel.length,
            height: AppConfig.delivery.auctionParcel.height,
            weight: AppConfig.delivery.auctionParcel.weight,
            units: AppConfig.delivery.auctionParcel.units,
          },
        });

        await auction.save();
      }
    } catch (error) {
      AppLogger.warn(`Unable to update auction parcel: ${error.message}`);
    }
  }

  //TODO: delete after attachments update.
  public async updateAttachments() {
    try {
      const auctions = await this.AuctionModel.find({});
      for (const auction of auctions) {
        for (const assetId of auction.assets) {
          const asset = await this.AssetModel.findById(assetId);
          await this.cloudStorage.updateAttachment(asset);
        }
      }
      return { message: 'Updated' };
    } catch (error) {
      AppLogger.warn(`Unable to update old attachments: ${error.message}`);
    }
  }

  public async followAuction(auctionId: string, accountId: string): Promise<{ user: string; createdAt: Dayjs }> | null {
    return await this.auctionRepository.followAuction(auctionId, accountId);
  }

  public async unfollowAuction(auctionId: string, accountId: string): Promise<{ id: string }> | null {
    return await this.auctionRepository.unfollowAuction(auctionId, accountId);
  }

  public async updateAuctionParcel(auctionId: string, input: AuctionParcel): Promise<AuctionParcel> {
    const auction = await this.AuctionModel.findById(auctionId);
    if (!auction) {
      throw new AppError('Auction not found', ErrorCode.BAD_REQUEST);
    }
    try {
      const { width, length, height, weight, units } = input;

      Object.assign(auction, {
        parcel: { width, length, height, weight, units },
      });

      await auction.save();

      return { width, length, height, weight, units };
    } catch (error) {
      AppLogger.error(`Failed to update auction parcel for auction #${auctionId}, error: ${error.message}`);
      throw new AppError('Failed to update auction parcel. Please, try later');
    }
  }

  public async getAuctionMetrics(auctionId: string): Promise<AuctionMetrics | null> {
    let metrics = await this.AuctionMetricModel.findOne({ auction: auctionId });
    const auction = await this.AuctionModel.findById(auctionId);

    if (metrics) {
      const { clicks, countries, referrers } = metrics;
      const clicksByDay = makeClicksByDay(clicks);

      return {
        clicks: fullBitlyClicks(clicks, auction.startsAt, 'hour'),
        clicksByDay: fullBitlyClicks(clicksByDay, auction.startsAt, 'day'),
        countries,
        referrers,
      };
    }

    metrics = await this.urlShortenerService.getAllMetrics(auction.link);
    const { clicks, countries, referrers } = metrics;
    const clicksByDay = makeClicksByDay(clicks);
    return {
      clicks: fullBitlyClicks(clicks, auction.startsAt, 'hour'),
      clicksByDay: fullBitlyClicks(clicksByDay, auction.startsAt, 'day'),
      countries,
      referrers,
    };
  }

  private async sendAuctionIsActivatedMessage(auction: IAuctionModel) {
    const currentAuction = await this.auctionRepository.getPopulatedAuction(auction);
    await this.sendNotificationForAuctionCharity(currentAuction);
    await this.sendNotificationsForCharityFollowers(currentAuction);
    await this.sendNotificationsForInfluencerFollowers(currentAuction);
  }

  private async sendNotificationForAuctionCharity(auction: IAuctionModel) {
    try {
      const charityUserAccount = await this.UserAccountModel.findById(auction.charity.userAccount).exec();
      if (!charityUserAccount) {
        AppLogger.error(`Cannot find account ${auction.charity.userAccount}`);
        return;
      }

      await this.sendAuctionNotification(charityUserAccount.phoneNumber, MessageTemplate.AUCTION_IS_CREATED_MESSAGE, {
        auctionTitle: auction.title,
        auctionLink: auction.link,
      });
    } catch (error) {
      AppLogger.error(`Failed to send notification, error: ${error.message}`);
    }
  }

  private async sendNotificationsForCharityFollowers(auction: IAuctionModel) {
    try {
      const charityFollowers = auction.charity.followers;
      charityFollowers?.forEach(async (follower) => {
        await this.sendAuctionNotification(
          follower.user.phoneNumber,
          MessageTemplate.AUCTION_IS_CREATED_MESSAGE_FOR_CHARITY_FOLLOWERS,
          {
            auctionLink: auction.link,
            charityName: auction.charity.name,
          },
        );
      });
    } catch (error) {
      AppLogger.error(`Failed to send notification, error: ${error.message}`);
    }
  }

  private async sendNotificationsForInfluencerFollowers(auction: IAuctionModel) {
    try {
      const auctionOrganizerFollowers = auction.auctionOrganizer.followers;

      auctionOrganizerFollowers?.forEach(async (follower) => {
        await this.sendAuctionNotification(
          follower.user.phoneNumber,
          MessageTemplate.AUCTION_IS_CREATED_MESSAGE_FOR_INFLUENCER_FOLLOWERS,
          {
            auctionLink: auction.link,
            influencerName: auction.auctionOrganizer.name,
          },
        );
      });
    } catch (error) {
      AppLogger.error(`Failed to send notification, error: ${error.message}`);
    }
  }

  public async createAuctionDraft(auctionOrganizerId: string, input: AuctionInput): Promise<Auction> {
    let auction = await this.auctionRepository.createAuction(auctionOrganizerId, input);
    auction = await this.auctionRepository.updateAuctionLink(
      auction._id,
      await this.makeShortAuctionLink(auction._id.toString()),
    );
    return this.makeAuction(auction);
  }

  public async getCustomerInformation(stripeCustomerId: string): Promise<{ email: string; phone: string } | null> {
    try {
      const customer = (await this.stripeService.getCustomerInformation(stripeCustomerId)) as Stripe.Customer;
      const { email, phone } = customer;
      return {
        email,
        phone,
      };
    } catch (error) {
      AppLogger.error(`Can't find current customer. ${error.message}`);
      return null;
    }
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

  public async getAuctionPriceLimits(params: IAuctionFilters): Promise<{ min: Dinero.Dinero; max: Dinero.Dinero }> {
    const { min, max } = await this.auctionRepository.getAuctionPriceLimits(params);
    return {
      min: Dinero({ amount: min, currency: AppConfig.app.defaultCurrency as Dinero.Currency }),
      max: Dinero({ amount: max, currency: AppConfig.app.defaultCurrency as Dinero.Currency }),
    };
  }

  public async getAuction(id: string, organizerId?: string): Promise<Auction> {
    try {
      const auction = await this.auctionRepository.getAuction(id, organizerId);
      return this.makeAuction(auction);
    } catch (error) {
      AppLogger.error(`Cannot find auction with id #${id}: ${error.message}`);
    }
  }

  public async maybeActivateAuction(id: string, organizerId: string): Promise<Auction> {
    const auction = await this.auctionRepository.activateAuction(id, organizerId);
    if (auction.status === AuctionStatus.ACTIVE) {
      await this.sendAuctionIsActivatedMessage(auction);
    }
    return this.makeAuction(auction);
  }

  public async addAuctionAttachment(
    id: string,
    organizerId: string | null,
    attachment: Promise<IFile>,
  ): Promise<AuctionAssets> {
    const auction = await this.auctionRepository.getAuction(id, organizerId);
    if (![AuctionStatus.DRAFT, AuctionStatus.PENDING].includes(auction?.status)) {
      throw new AppError('Auction does not exist or cannot be edited', ErrorCode.NOT_FOUND);
    }
    AppLogger.error(`Attachment uploading for auction #${auction._id.toString()} started`);
    try {
      const asset = await this.attachmentsService.uploadFileAttachment(
        id,
        auction.auctionOrganizer._id.toString(),
        attachment,
      );
      const { filename } = await attachment;

      await this.AuctionModel.updateOne({ _id: id }, { $addToSet: { assets: asset } });

      return AuctionService.makeAuctionAttachment(asset, filename);
    } catch (error) {
      AppLogger.error(
        `Could not upload attachment for auction #${auction._id.toString()} with error: ${error.message}`,
      );
      throw new AppError('Could not upload this file. Please, try later', ErrorCode.BAD_REQUEST);
    }
  }

  public async getTotalRaisedAmount(
    charityId?: string,
    influencerId?: string,
  ): Promise<{ totalRaisedAmount: Dinero.Dinero }> {
    if (!charityId && !influencerId) {
      throw new Error('Need to pass charityId or influencerId');
    }

    const filters = { status: AuctionStatus.SETTLED };
    if (charityId) {
      filters['charity'] = charityId;
    }

    if (influencerId) {
      filters['influencerId'] = influencerId;
    }

    const auctions = await this.AuctionModel.find(filters);
    return {
      totalRaisedAmount: AuctionService.makeTotalRaisedAmount(auctions),
    };
  }

  public async createOrUpdateAuctionMetrics(link: string, auctionId: string): Promise<void> {
    const session = await this.connection.startSession();
    const transactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    };
    session.startTransaction(transactionOptions);

    try {
      const metricsModel = await this.AuctionMetricModel.findOne({ auction: auctionId }, null, { session });
      await this.getMetrics(metricsModel, session, auctionId, link);
      await session.commitTransaction();
    } catch (error) {
      AppLogger.error(
        `Something went wrong during AuctionMertics update for auction #${auctionId}. Error: ${error.message}`,
      );
      await session.abortTransaction();
    }
  }

  public async getMetrics(
    metricsModel: IAuctionMetricModel,
    session: ClientSession,
    auctionId: string,
    link: string,
  ): Promise<any> {
    if (metricsModel) {
      const units = dayjs().diff(dayjs(metricsModel.lastUpdateAt), 'm');
      if (units === 0) {
        return;
      }

      const { clicks, referrers, countries } = await this.urlShortenerService.getMetricsFromLastUpdate(link, units);

      Object.assign(metricsModel, {
        clicks: Array.from(
          new Set([...metricsModel.clicks, ...clicks].map((value: BitlyClick) => JSON.stringify(value))),
        ).map((value: string) => JSON.parse(value)),
        referrers: concatMetrics(metricsModel.referrers, referrers),
        countries: concatMetrics(metricsModel.countries, countries),
        lastUpdateAt: dayjs().toISOString(),
      });

      await metricsModel.save({ session });
    } else {
      const { clicks, referrers, countries } = await this.urlShortenerService.getAllMetrics(link);
      await this.AuctionMetricModel.create(
        [
          {
            auction: auctionId,
            clicks,
            referrers,
            countries,
            lastUpdateAt: dayjs().toISOString(),
          },
        ],
        { session },
      );
    }
  }

  public async updateAuction(id: string, userId: string, input: AuctionInput, isAdmin: boolean): Promise<Auction> {
    const {
      title,
      startDate,
      endDate,
      charity,
      startPrice,
      itemPrice,
      description,
      fullPageDescription,
      playedIn,
      sport,
      fairMarketValue,
      timeZone,
      ...rest
    } = objectTrimmer(input);
    const auction = await this.auctionRepository.updateAuction(
      id,
      userId,
      {
        ...(title ? { title } : {}),
        ...(startDate ? { startsAt: startDate } : {}),
        ...(endDate ? { endsAt: endDate } : {}),
        ...(startPrice
          ? {
              startPrice: startPrice.getAmount(),
              currentPrice: startPrice.getAmount(),
              priceCurrency: startPrice.getCurrency(),
            }
          : {}),
        ...(itemPrice
          ? {
              itemPrice: itemPrice.getAmount(),
            }
          : {}),
        ...(fairMarketValue
          ? {
              fairMarketValue: fairMarketValue.getAmount(),
            }
          : {}),
        ...(charity ? { charity: Types.ObjectId(charity) } : {}),
        ...(description ? { description } : {}),
        ...(fullPageDescription ? { fullPageDescription } : {}),
        ...(sport ? { sport } : {}),
        ...(playedIn ? { playedIn } : {}),
        ...(timeZone ? { timeZone } : {}),
        ...rest,
      },
      isAdmin,
    );
    return this.makeAuction(auction);
  }

  public async addAuctionBid(id: string, { bid, user }: ICreateAuctionBidInput & { user: UserAccount }): Promise<Bid> {
    const session = await this.connection.startSession();
    await session.startTransaction();

    const card = await this.paymentService.getAccountPaymentInformation(user);
    if (!card) {
      throw new AppError('Payment method is not provided');
    }

    const auction = await this.AuctionModel.findById(id, null, { session }).exec();

    if (!auction.charity) {
      throw new AppError('There is no charity attached to given auction');
    }

    if (auction.status !== AuctionStatus.ACTIVE) {
      throw new AppError('Auction is not active', ErrorCode.BAD_REQUEST);
    }

    if (dayjs().utc().isAfter(auction.endsAt)) {
      throw new AppError('Auction has already ended', ErrorCode.BAD_REQUEST);
    }

    const currentPrice = Dinero({
      amount: auction.currentPrice,
      currency: (auction.priceCurrency || AppConfig.app.defaultCurrency) as Currency,
    });

    if (bid.lessThanOrEqual(currentPrice)) {
      throw new AppError(
        'Provided bid is lower, than maximum bid that was encountered on the auction',
        ErrorCode.BAD_REQUEST,
      );
    }

    const [lastBid] = await this.BidModel.find({ auction: auction._id }, null, session).sort({ bid: -1 }).limit(1);

    const bidInput = {
      user: user.mongodbId,
      auction: auction._id,
      bid: bid.getAmount(),
      bidCurrency: (bid.getCurrency() ?? AppConfig.app.defaultCurrency) as Dinero.Currency,
      paymentSource: card.id,
      chargeId: null,
    };

    const createdBid = await this.bidService.createBid(bidInput, session);

    auction.currentPrice = bid.getAmount();
    auction.totalBids += 1;

    await auction.save({ session });
    await session.commitTransaction();

    if (lastBid && lastBid.user.toString() !== user.mongodbId) {
      try {
        const userAccount = await this.UserAccountModel.findById(lastBid.user);
        if (!userAccount) {
          throw new AppError(`Cannot find user with #${lastBid.user}`);
        }
        await this.sendAuctionNotification(userAccount.phoneNumber, MessageTemplate.AUCTION_BID_OVERLAP, {
          auctionTitle: auction.title,
          auctionLink: auction.link,
        });
      } catch (error) {
        AppLogger.error(`Failed to send notification, error: ${error.message}`);
      }
    }
    return createdBid;
  }

  public async scheduleAuctionMetrics(): Promise<{ message: string }> {
    const auctions = await this.AuctionModel.find({
      status: {
        $in: [
          AuctionStatus.ACTIVE,
          AuctionStatus.FAILED,
          AuctionStatus.PENDING,
          AuctionStatus.SETTLED,
          AuctionStatus.SOLD,
          AuctionStatus.STOPPED,
        ],
      },
    });
    for (const auction of auctions) {
      try {
        await this.createOrUpdateAuctionMetrics(auction.link, auction._id.toString());
      } catch (error) {
        AppLogger.error(`Something went wrong during Auction Metrics update. Error: ${error.message}`);
      }
    }
    return { message: 'Scheduled' };
  }

  public async scheduleAuctionJobSettle(): Promise<{ message: string }> {
    const auctions = await this.AuctionModel.find({ status: AuctionStatus.ACTIVE });

    for await (const auction of auctions) {
      if (dayjs().utc().isAfter(auction.endsAt)) {
        try {
          await this.settleAuctionAndCharge(auction);
        } catch {}
      }
    }
    return { message: 'Scheduled' };
  }

  public async scheduleAuctionEndsNotification(): Promise<{ message: string }> {
    const auctions = await this.AuctionModel.find({ status: AuctionStatus.ACTIVE });

    for await (const auction of auctions) {
      await this.sendLastNotificationForUsers(auction);
      await this.sendFirstNotificationForUsers(auction);
      await this.sendNotificationForAuctionOrganizer(auction);
    }
    return { message: 'Scheduled' };
  }

  private async sendLastNotificationForUsers(auction: IAuctionModel): Promise<void> {
    if (
      auction.endsAt.diff(dayjs().utc(), 'minute') > AppConfig.googleCloud.auctionEndsTime.lastNotification ||
      auction.sentNotifications.includes('lastNotification')
    ) {
      return;
    }
    try {
      const timeLeftText = `${AppConfig.googleCloud.auctionEndsTime.lastNotification - 1} minutes`;
      await this.notifyUsers(auction, timeLeftText);
      auction.sentNotifications.push('lastNotification');
      await auction.save();
    } catch (error) {
      AppLogger.warn(
        `Something went wrong during notification about action #${auction._id.toString()} ending. Error: ${
          error.message
        }`,
      );
    }
  }

  private async sendFirstNotificationForUsers(auction: IAuctionModel): Promise<void> {
    if (
      auction.endsAt.diff(dayjs().utc(), 'minute') > AppConfig.googleCloud.auctionEndsTime.firstNotification ||
      auction.sentNotifications.includes('firstNotification')
    ) {
      return;
    }
    try {
      const timeLeftText = `${Math.floor((AppConfig.googleCloud.auctionEndsTime.firstNotification - 1) / 60)} hour`;
      await this.notifyUsers(auction, timeLeftText);
      auction.sentNotifications.push('firstNotification');
      await auction.save();
    } catch (error) {
      AppLogger.warn(
        `Something went wrong during notification about action #${auction._id.toString()} ending. Error: ${
          error.message
        }`,
      );
    }
  }

  private async sendNotificationForAuctionOrganizer(auction: IAuctionModel): Promise<void> {
    if (
      auction.endsAt.diff(dayjs().utc(), 'minute') >
        AppConfig.googleCloud.auctionEndsTime.notificationForAuctionOrganizer ||
      Math.abs(dayjs(auction.startsAt).diff(auction.endsAt, 'hour')) <= 24 ||
      auction.sentNotifications.includes('notificationForAuctionOrganizer')
    ) {
      return;
    }
    try {
      await this.notifyAuctionOrganizer(auction);
      auction.sentNotifications.push('notificationForAuctionOrganizer');
      await auction.save();
    } catch (error) {
      AppLogger.warn(
        `Something went wrong during notification about action ending for auction organizer. Id of auction: ${auction._id.toString()}: ${
          error.message
        }`,
      );
    }
  }

  private async notifyAuctionOrganizer(auction: IAuctionModel): Promise<void> {
    const currentAuction = await this.auctionRepository.getAuctionOrganizerUserAccountFromAuction(auction);

    const phoneNumber = currentAuction.auctionOrganizer.userAccount.phoneNumber;
    const shortUrl = await this.makeShortAuctionLink(currentAuction._id.toString());

    await this.sendAuctionNotification(phoneNumber, MessageTemplate.AUCTION_ENDS_MESSAGE_FOR_AUCTIONORGANIZER, {
      auctionTitle: currentAuction.title,
      auctionPrice: Dinero({
        amount: currentAuction.currentPrice,
        currency: currentAuction.priceCurrency as Currency,
      }).toFormat('$0,0'),
      shortUrl,
    });
  }

  private async notifyUsers(auction: IAuctionModel, timeLeftText: string): Promise<void> {
    if (!auction) {
      throw new Error(`There is no auction for sending notification`);
    }

    const currentAuction = await this.auctionRepository.getPopulatedAuction(auction);
    const followerIds = currentAuction.followers.map((follower) => follower.user);
    const followerUsers = await this.UserAccountModel.find({ _id: followerIds }).exec();
    const followersPhonenumber = followerUsers.map((user) => user.phoneNumber);
    const bidModels = await this.bidService.getPopulatedBids(auction._id);
    const bidsUserPhonenumber = bidModels.map((bid) => bid.user.phoneNumber);
    const phoneNumbers = new Set([...followersPhonenumber, ...bidsUserPhonenumber]);

    phoneNumbers.forEach(async (phoneNumber) => {
      try {
        await this.sendAuctionNotification(phoneNumber, MessageTemplate.AUCTION_ENDS_MESSAGE_FOR_USERS, {
          timeLeftText,
          influencerName: currentAuction.auctionOrganizer.name,
          aunctionName: currentAuction.title,
          auctionLink: currentAuction.link,
        });
      } catch (error) {
        AppLogger.warn(
          `Something went wrong during notification about action ending. Id of auction: ${currentAuction._id.toString()}: ${
            error.message
          }`,
        );
      }
    });
  }

  public async scheduleAuctionJobStart(): Promise<{ message: string }> {
    const auctions = await this.AuctionModel.find({ status: AuctionStatus.PENDING });

    for await (const auction of auctions) {
      if (dayjs().utc().isAfter(auction.startsAt) || dayjs().utc().isSame(auction.startsAt)) {
        try {
          await this.activateAuction(auction);
        } catch (error) {
          AppLogger.warn(`Could not start auction with id ${auction.id.toString()} with error: ${error.message}`);
        }
      }
    }
    return { message: 'Scheduled' };
  }

  public async getInfluencersAuctions(id: string): Promise<Auction[]> {
    const auctions = await this.auctionRepository.getInfluencersAuctions(id);
    return auctions.map((auction) => this.makeAuction(auction));
  }

  public async settleAndChargeCurrentAuction(id: string): Promise<void> {
    const auction = await this.AuctionModel.findOne({ _id: id });
    if (auction.status !== AuctionStatus.ACTIVE) {
      auction.status = AuctionStatus.ACTIVE;
      await auction.save();
    }
    return await this.settleAuctionAndCharge(auction);
  }

  public async chargeCurrendBid(input): Promise<string> {
    const { user, bid, charityId, charityStripeAccountId, auctionTitle, paymentSource } = input;
    return await this.paymentService.chargeUser(
      user,
      paymentSource,
      bid,
      `Contrib auction: ${auctionTitle}`,
      charityStripeAccountId,
      charityId,
    );
  }

  public async settleAuctionAndCharge(auction: IAuctionModel): Promise<void> {
    if (!auction) {
      throw new AppError('Auction not found');
    }

    if (!auction.charity) {
      throw new AppError('There is no charity attached to given auction');
    }

    if (auction.status !== AuctionStatus.ACTIVE) {
      throw new AppError('Auction status is not ACTIVE');
    }

    const [lastAuctionBid] = await this.BidModel.find({ auction: auction._id }).sort({ bid: -1 }).limit(1);

    if (!lastAuctionBid) {
      auction.status = AuctionStatus.SETTLED;
      await auction.save();
      return;
    }

    try {
      await lastAuctionBid.populate({ path: 'user', model: this.UserAccountModel }).execPopulate();
      lastAuctionBid.chargeId = await this.chargeUser(lastAuctionBid, auction);
      await this.sendAuctionNotification(lastAuctionBid.user.phoneNumber, MessageTemplate.AUCTION_WON_MESSAGE, {
        auctionTitle: auction.title,
        auctionLink: auction.link,
      });

      AppLogger.info(
        `Auction with id ${auction.id} has been settled with charge id ${
          lastAuctionBid.chargeId
        } and user id ${lastAuctionBid.user._id.toString()}`,
      );

      auction.winner = lastAuctionBid.user._id.toString();
      auction.status = AuctionStatus.SETTLED;
      await lastAuctionBid.save();
      await auction.save();
    } catch (error) {
      AppLogger.error(`Unable to charge user ${lastAuctionBid.user._id.toString()}, with error: ${error.message}`);
      auction.status = AuctionStatus.FAILED;
      await auction.save();
      throw new AppError('Unable to charge');
    }
  }

  async chargeUser(lastAuctionBid: IBidModel, auction: IAuctionModel): Promise<string> {
    const charityAccount = await this.CharityModel.findOne({ _id: auction.charity }).exec();
    if (!charityAccount) {
      throw new Error(`Can not find charity account with id ${auction.charity.toString()}`);
    }

    return await this.paymentService.chargeUser(
      lastAuctionBid.user,
      lastAuctionBid.paymentSource,
      this.makeBidDineroValue(lastAuctionBid.bid, lastAuctionBid.bidCurrency),
      `Contrib auction: ${auction.title}`,
      charityAccount.stripeAccountId,
      auction.charity.toString(),
    );
  }

  async sendAuctionNotification(
    phoneNumber: string,
    template: MessageTemplate,
    context?: { [key: string]: any },
  ): Promise<void> {
    try {
      const message = await this.handlebarsService.renderTemplate(template, context);
      await this.cloudTaskService.createTask(this.generateGoogleTaskTarget(), {
        message,
        phoneNumber,
      });
    } catch (error) {
      AppLogger.warn(`Can not send the notification to ${phoneNumber}: ${error.message}`);
    }
  }

  private makeBidDineroValue(amount: number, currency: Dinero.Currency) {
    return Dinero({ amount: amount, currency: (currency ?? AppConfig.app.defaultCurrency) as Dinero.Currency });
  }

  public async activateAuction(auction: IAuctionModel): Promise<void> {
    if (!auction) {
      throw new AppError('Auction not found');
    }
    auction.status = AuctionStatus.ACTIVE;

    await auction.save();
    await this.sendAuctionIsActivatedMessage(auction);

    return;
  }

  private generateGoogleTaskTarget(): string {
    const appURL = new URL(AppConfig.app.url);

    if (!AppConfig.environment.serveClient) {
      appURL.port = AppConfig.app.port.toString();
    }
    return `${appURL.toString()}${AppConfig.googleCloud.task.notificationTaskTargetURL}`;
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

  public static makeTotalRaisedAmount(auctions: IAuctionModel[]): Dinero.Dinero {
    if (!auctions) {
      return Dinero({ amount: 0, currency: AppConfig.app.defaultCurrency as Dinero.Currency });
    }
    return auctions
      .map((a) =>
        Dinero({
          amount: a.currentPrice ?? 0,
          currency: (a.priceCurrency ?? AppConfig.app.defaultCurrency) as Dinero.Currency,
        }),
      )
      .reduce(
        (total, next) => total.add(next),
        Dinero({ amount: 0, currency: AppConfig.app.defaultCurrency as Dinero.Currency }),
      );
  }

  private makeLongAuctionLink(id: string) {
    const url = new URL(AppConfig.app.url);
    url.pathname = `/auctions/${id}`;
    return url.toString();
  }

  private async makeShortAuctionLink(id: string) {
    return this.urlShortenerService.shortenUrl(this.makeLongAuctionLink(id));
  }

  private makeAssets(assets: IAuctionAssetModel[]): AuctionAssets[] {
    return assets
      .map((asset) => AuctionService.makeAuctionAttachment(asset))
      .sort((a: any, b: any) => {
        if (b.type > a.type) return -1;
      });
  }

  public async buyAuction(id: string, user: UserAccount): Promise<Auction> {
    const auction = await this.auctionRepository.getAuction(id);

    if (!auction) {
      throw new AppError('Auction not found', ErrorCode.BAD_REQUEST);
    }

    if (!auction.charity) {
      throw new AppError('There is no charity attached to given auction');
    }

    if (auction.status !== AuctionStatus.ACTIVE) {
      throw new AppError('Auction is not active', ErrorCode.BAD_REQUEST);
    }
    if (auction.currentPrice > auction.itemPrice) {
      throw new AppError('Auction has larger current price', ErrorCode.BAD_REQUEST);
    }

    const card = await this.paymentService.getAccountPaymentInformation(user);
    if (!card) {
      throw new AppError('Payment method is not provided');
    }

    try {
      const chargeId = await this.paymentService.chargeUser(
        user,
        card.id,
        this.makeBidDineroValue(auction.itemPrice, auction.priceCurrency as Dinero.Currency),
        `Contrib auction: ${auction.title}`,
        auction.charity.stripeAccountId,
        auction.charity._id.toString(),
      );

      const bidInput = {
        user: user.mongodbId,
        auction: auction._id,
        bid: auction.itemPrice,
        bidCurrency: (auction.priceCurrency ?? AppConfig.app.defaultCurrency) as Dinero.Currency,
        paymentSource: card.id,
        chargeId,
      };

      await this.bidService.createBid(bidInput);
    } catch (error) {
      AppLogger.info(`Unable to charge auction #${auction.id}: ${error.message}`);
      throw new AppError('Unable to charge');
    }

    AppLogger.info(`Auction with id ${auction.id} has been sold`);

    auction.winner = user.mongodbId;
    auction.status = AuctionStatus.SOLD;
    auction.currentPrice = auction.itemPrice;
    auction.stoppedAt = dayjs().second(0);

    try {
      await auction.save();
    } catch (error) {
      throw new AppError('Something went wrong', ErrorCode.BAD_REQUEST);
    }
    return this.makeAuction(auction);
  }

  public async stopAuction(id: string): Promise<Auction> {
    const auction = await this.auctionRepository.getAuction(id);

    auction.status = AuctionStatus.STOPPED;
    auction.stoppedAt = dayjs().second(0);

    try {
      await auction.save();
    } catch (error) {
      throw new AppError('Something went wrong', ErrorCode.BAD_REQUEST);
    }
    return this.makeAuction(auction);
  }
  public async activateAuctionById(id: string): Promise<Auction> {
    const auction = await this.auctionRepository.getAuction(id);

    auction.endsAt < dayjs() ? (auction.status = AuctionStatus.SETTLED) : (auction.status = AuctionStatus.ACTIVE);
    auction.stoppedAt = null;

    try {
      await auction.save();
      if (auction.status === AuctionStatus.ACTIVE) {
        await this.sendAuctionIsActivatedMessage(auction);
      }
    } catch (error) {
      throw new AppError(`Something went wrong, ${error.message}`, ErrorCode.BAD_REQUEST);
    }
    return this.makeAuction(auction);
  }

  private async deleteAttachmentFromCloud(url: string, uid: string | undefined): Promise<void> {
    if (uid) {
      const cloudflareStreaming = new CloudflareStreaming();
      await cloudflareStreaming.deleteFromCloudFlare(uid);
    }
    await this.attachmentsService.removeFileAttachment(url);
  }

  public async deleteAuctionAttachment(
    auctionId: string,
    organizerId: string,
    attachmentUrl: string,
  ): Promise<AuctionAssets> {
    const auction = await this.auctionRepository.getAuction(auctionId, organizerId);
    if (!auction) {
      throw new AppError('Auction not found', ErrorCode.NOT_FOUND);
    }
    const attachment = await this.attachmentsService.AuctionAsset.findOne({ url: attachmentUrl });
    if (!attachment) {
      throw new AppError('Attachment not found', ErrorCode.NOT_FOUND);
    }
    try {
      await this.deleteAttachmentFromCloud(attachment.url, attachment.uid);

      await auction.updateOne({ $pull: { assets: attachment._id } });
      await attachment.delete();

      return AuctionService.makeAuctionAttachment(attachment);
    } catch (error) {
      AppLogger.error(`Cannot delete auction attachment #${attachment._id.toString()}: ${error.message}`);
      throw new AppError(`Cannot delete attachment`, ErrorCode.BAD_REQUEST);
    }
  }

  public async deleteAuctionAttachmentById(assetId: string) {
    try {
      const attachment = await this.attachmentsService.AuctionAsset.findByIdAndDelete(assetId);
      await this.deleteAttachmentFromCloud(attachment.url, attachment.uid);
    } catch (error) {
      AppLogger.error(`Cannot delete auction attachment #${assetId}: ${error.message}`);
      throw new AppError('Cannot delete attachment', ErrorCode.BAD_REQUEST);
    }
  }

  public async deleteAuction(auctionId: string) {
    const auction = await this.AuctionModel.findById(auctionId);
    if (!auction) {
      throw new AppError('Can not find auction', ErrorCode.NOT_FOUND);
    }

    if (auction.status !== AuctionStatus.DRAFT) {
      throw new AppError('Auction is not DRAFT', ErrorCode.BAD_REQUEST);
    }

    try {
      auction.assets.forEach(async (assetId) => await this.deleteAuctionAttachmentById(assetId));
      await this.AuctionModel.deleteOne({ _id: auctionId });
    } catch (error) {
      AppLogger.error(`Cannot delete auction #${auction.id}: ${error.message}`);
      throw new AppError('Cannot delete auction', ErrorCode.BAD_REQUEST);
    }
  }

  public makeAuction(model: IAuctionModel): Auction | null {
    const {
      _id,
      startsAt,
      endsAt,
      charity,
      assets,
      status,
      itemPrice,
      currentPrice,
      startPrice,
      auctionOrganizer,
      priceCurrency,
      fairMarketValue,
      link: rawLink,
      followers,
      winner,
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
      winner: winner?.toString(),
      attachments: this.makeAssets(assets),
      endDate: endsAt,
      startDate: startsAt,
      charity: charity ? CharityService.makeCharity(charity) : null,
      currentPrice: Dinero({
        currency: (priceCurrency ?? AppConfig.app.defaultCurrency) as Dinero.Currency,
        amount: currentPrice,
      }),
      startPrice: Dinero({
        currency: (priceCurrency ?? AppConfig.app.defaultCurrency) as Dinero.Currency,
        amount: startPrice,
      }),
      itemPrice: itemPrice
        ? Dinero({
            currency: (priceCurrency ?? AppConfig.app.defaultCurrency) as Dinero.Currency,
            amount: itemPrice,
          })
        : null,
      fairMarketValue: fairMarketValue
        ? Dinero({
            currency: (priceCurrency ?? AppConfig.app.defaultCurrency) as Dinero.Currency,
            amount: fairMarketValue,
          })
        : null,
      auctionOrganizer: InfluencerService.makeInfluencerProfile(auctionOrganizer),
      followers: followers.map((follower) => {
        return {
          user: follower.user,
          createdAt: follower.createdAt,
        };
      }),
      link,
      status,
      isActive: status === AuctionStatus.ACTIVE,
      isDraft: status === AuctionStatus.DRAFT,
      isPending: status === AuctionStatus.PENDING,
      isSettled: status === AuctionStatus.SETTLED,
      isFailed: status === AuctionStatus.FAILED,
      isSold: status === AuctionStatus.SOLD,
      isStopped: status === AuctionStatus.STOPPED,
      ...rest,
    };
  }
}
