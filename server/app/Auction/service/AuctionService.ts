import { Connection, Types, ClientSession } from 'mongoose';
import dayjs, { Dayjs } from 'dayjs';
import Dinero, { Currency } from 'dinero.js';
import Stripe from 'stripe';

import { AuctionModel, IAuctionModel } from '../mongodb/AuctionModel';
import { AuctionMetricModel, IAuctionMetricModel } from '../mongodb/AuctionMetricModel';
import { AuctionAssetModel, IAuctionAssetModel } from '../mongodb/AuctionAssetModel';
import { AuctionAttachmentsService } from './AuctionAttachmentsService';
import { UserAccountModel } from '../../UserAccount/mongodb/UserAccountModel';
import { UPSDeliveryService } from '../../UPSService';

import { AuctionStatus } from '../dto/AuctionStatus';
import { AuctionDeliveryStatus } from '../dto/AuctionDeliveryStatus';
import { Auction } from '../dto/Auction';
import { AuctionsForProfilePage } from '../dto/AuctionsForProfilePage';
import { AuctionAssets } from '../dto/AuctionAssets';
import { AuctionParcel } from '../dto/AuctionParcel';
import { Bid } from '../../Bid/dto/Bid';
import { AuctionMetrics } from '../dto/AuctionMetrics';
import { UserAccount } from '../../UserAccount/dto/UserAccount';

import { BidService } from '../../Bid/service/BidService';
import { BidModel, IBidModel } from '../../Bid/mongodb/BidModel';

import { AuctionAttachmentInput } from '../graphql/model/AuctionAttachmentInput';
import { AuctionInput } from '../graphql/model/AuctionInput';
import { GCloudStorage, IFile } from '../../GCloudStorage';
import { ICreateAuctionBidInput } from '../graphql/model/CreateAuctionBidInput';

import { CloudflareStreaming } from '../../CloudflareStreaming';
import { InfluencerService } from '../../Influencer';
import { CharityService } from '../../Charity';

import { AppError, ErrorCode } from '../../../errors';
import { AppLogger } from '../../../logger';
import { makeClicksByDay } from '../../../helpers/makeClicksByDay';
import { getMetricByEntity } from '../../../helpers/getMetricByEntity';
import { objectTrimmer } from '../../../helpers/objectTrimmer';
import { fullClicks } from '../../../helpers/fullClicks';
import { getParsedMetric } from '../../../helpers/getParsedMetric';

import { AuctionRepository } from '../repository/AuctionRepository';
import { IAuctionFilters, IAuctionRepository } from '../repository/IAuctionRepoository';
import { PaymentService, StripeService } from '../../Payment';
import { ShortLinkService } from '../../ShortLink';
import { AppConfig } from '../../../config';
import { NotificationService, MessageTemplate } from '../../NotificationService';
import { CharityModel } from '../../Charity/mongodb/CharityModel';
import { InfluencerModel } from '../../Influencer/mongodb/InfluencerModel';

export class AuctionService {
  private readonly AuctionModel = AuctionModel(this.connection);
  private readonly AuctionMetricModel = AuctionMetricModel(this.connection);
  private readonly UserAccountModel = UserAccountModel(this.connection);
  private readonly CharityModel = CharityModel(this.connection);
  private readonly InfluencerModel = InfluencerModel(this.connection);
  private readonly BidModel = BidModel(this.connection);
  private readonly AssetModel = AuctionAssetModel(this.connection);
  private readonly auctionRepository: IAuctionRepository = new AuctionRepository(this.connection);

  constructor(
    private readonly connection: Connection,
    private readonly paymentService: PaymentService,
    private readonly cloudStorage: GCloudStorage,
    private readonly notificationService: NotificationService,
    private readonly bidService: BidService,
    private readonly stripeService: StripeService,
    private readonly shortLinkService: ShortLinkService,
    private readonly attachmentsService: AuctionAttachmentsService,
    private readonly UPSService: UPSDeliveryService,
  ) {}

  public async getAuctionsForProfilePage(userId: string): Promise<AuctionsForProfilePage | null> {
    try {
      const allBids = await this.BidModel.find({ user: userId });
      const auctionIds = allBids.map((bid) => bid.auction.toString());
      const uniqAuctionIds = Array.from(new Set(auctionIds));

      if (!uniqAuctionIds.length) {
        return {
          live: [],
          won: [],
        };
      }

      const auctionModels = await this.auctionRepository.getAuctions({
        filters: { ids: uniqAuctionIds },
      });
      const auctions = auctionModels.map((auctionModel) => AuctionService.makeAuction(auctionModel));

      return auctions.reduce(
        (acc: AuctionsForProfilePage, cur: Auction) => {
          if (cur.isActive) {
            acc.live = [...acc.live, cur];
            return acc;
          }
          if (cur?.winner?.mongodbId === userId) {
            acc.won = [...acc.won, cur];
            return acc;
          }

          return acc;
        },
        { live: [], won: [] },
      );
    } catch (error) {
      AppLogger.error(
        `Something went wrong when try to get auctions for profile page for user #${userId}, error: ${error.message}`,
      );
      throw new AppError('Something went wrong, please try later');
    }
  }

  public async updateTotalRaisedAmount(auction: IAuctionModel, amount: number): Promise<void> {
    const { charity, auctionOrganizer } = auction;

    charity.totalRaisedAmount += amount;
    auctionOrganizer.totalRaisedAmount += amount;

    await charity.save();
    await auctionOrganizer.save();
  }

  public getContentStorageAuthData(): { authToken: string; accountId: string } {
    return { authToken: AppConfig.cloudflare.token, accountId: AppConfig.cloudflare.user };
  }

  public async calculateShippingCost(
    auctionId: string,
    deliveryMethod: string,
    userId: string,
  ): Promise<{ deliveryPrice: Dinero.Dinero; timeInTransit: Dayjs }> {
    const auction = await this.auctionRepository.getAuction(auctionId);
    if (!auction) {
      AppLogger.error(`Can not find auction with id #${auctionId} when calculate shipping cost`);
      throw new AppError('Something went wrong. Please try again later');
    }
    if (auction.winner._id.toString() !== userId) {
      AppLogger.error(`User #${userId} is not a winner for auction #${auctionId} when calculate shipping cost`);
      throw new AppError('You are not a winner for this auction');
    }
    const { address } = auction.delivery;
    try {
      return await this.UPSService.getDeliveryPrice(address, deliveryMethod);
    } catch (error) {
      AppLogger.error(
        `Something went wrong when calculated shipping cost for auction #${auctionId}, ${error.message} `,
      );
      throw new AppError(error.message);
    }
  }

  public async chargeUserForShippingRegistration(
    auction: IAuctionModel,
    deliveryMethod: string,
    timeInTransit: Dayjs | undefined,
  ): Promise<void> {
    const { _id: winnerId } = auction.winner;
    try {
      const { id: cardId } = await this.paymentService.getAccountPaymentInformation(auction.winner);
      if (!cardId) {
        AppLogger.error(
          `Can not find payment information for user #${winnerId.toString()} in shippingRegistration method`,
        );
        throw new AppError('Something went wrong. Please try again later');
      }

      const { deliveryPrice } = await this.calculateShippingCost(
        auction._id.toString(),
        deliveryMethod,
        winnerId.toString(),
      );

      await this.paymentService.chargeUser(
        auction.winner,
        cardId,
        deliveryPrice,
        `Contrib register shipping for auction: ${auction.title}`,
      );

      Object.assign(auction.delivery, {
        status: AuctionDeliveryStatus.PAID,
        updatedAt: this.timeNow(),
        timeInTransit,
      });
      Object.assign(auction, { updatedAt: this.timeNow() });

      await auction.save();
      await this.notifyOrganizerAboutDelivery(auction);
    } catch (error) {
      AppLogger.error(
        `Something went wrong when charge user #${winnerId.toString()} in stipe in shippingRegistration method, error: ${
          error.message
        }`,
      );
      throw new AppError('Something went wrong. Please try again later');
    }
  }

  private async notifyOrganizerAboutDelivery(auction: IAuctionModel): Promise<void> {
    const deliveryInfoShortLink = await this.shortLinkService.createShortLink({
      address: `auctions/${auction._id.toString()}/delivery/info`,
    });

    await this.notificationService.sendMessageLater(
      auction.winner.phoneNumber,
      MessageTemplate.AUCTION_DELIVERY_DETAILS_FOR_ORGANIZER,
      {
        auctionTitle: auction.title,
        link: ShortLinkService.makeLink({ slug: deliveryInfoShortLink.slug }),
      },
    );
  }

  public async sendRequestForShippingRegistration(
    auction: IAuctionModel,
    deliveryMethod: string | undefined,
  ): Promise<{ deliveryPrice: Dinero.Dinero; identificationNumber: string }> {
    const { address } = auction.delivery;
    try {
      const { deliveryPrice, identificationNumber, shippingLabel } = await this.UPSService.shippingRegistration(
        address,
        deliveryMethod || auction.delivery.deliveryMethod,
      );

      const barcode = await this.cloudStorage.uploadBase64(shippingLabel, {
        identificationNumber,
        auctionId: auction._id.toString(),
        organizerId: auction.auctionOrganizer._id.toString(),
      });

      Object.assign(auction.delivery, {
        status: AuctionDeliveryStatus.DELIVERY_PAID,
        updatedAt: this.timeNow(),
        identificationNumber,
        shippingLabel: barcode,
      });
      Object.assign(auction, {
        updatedAt: this.timeNow(),
      });
      await auction.save();

      const trackingShortLink = await this.shortLinkService.createShortLink({
        path: this.UPSService.trackingUrl(identificationNumber),
      });

      await this.notificationService.sendMessageLater(
        auction.winner.phoneNumber,
        MessageTemplate.AUCTION_DELIVERY_DETAILS_FOR_WINNER,
        {
          auctionTitle: auction.title,
          trackingLink: ShortLinkService.makeLink({ slug: trackingShortLink.slug }),
          identificationNumber,
        },
      );

      return {
        deliveryPrice,
        identificationNumber,
      };
    } catch (error) {
      Object.assign(auction.delivery, {
        status: AuctionDeliveryStatus.DELIVERY_PAYMENT_FAILED,
        updatedAt: this.timeNow(),
      });
      Object.assign(auction, {
        updatedAt: this.timeNow(),
      });
      await auction.save();

      throw new Error(error.message);
    }
  }

  public async shippingRegistration(
    input: {
      auctionId: string;
      timeInTransit?: Dayjs;
      auctionWinnerId?: string;
      deliveryMethod?: string;
    },
    currentUserId: string,
  ): Promise<{ deliveryPrice: Dinero.Dinero; identificationNumber: string }> {
    const { timeInTransit, auctionWinnerId, deliveryMethod, auctionId } = input;

    const auction = await this.auctionRepository.getAuction(auctionId);
    if (!auction) {
      AppLogger.error(`Can not find auction with id #${auctionId} when register shipping`);
      throw new AppError('Something went wrong. Please try again later');
    }

    const currentAuctionWinnerId = auctionWinnerId || currentUserId;
    if (auction.winner._id.toString() !== currentAuctionWinnerId) {
      AppLogger.error(
        `User #${currentAuctionWinnerId} is not a winner for auction #${auctionId} when register shipping`,
      );
      throw new AppError('You are not a winner for this auction');
    }

    if (auction.delivery.status === AuctionDeliveryStatus.ADDRESS_PROVIDED)
      await this.chargeUserForShippingRegistration(auction, deliveryMethod, timeInTransit);

    if (deliveryMethod) {
      try {
        auction.delivery.deliveryMethod = deliveryMethod;
        Object.assign(auction, {
          updatedAt: this.timeNow(),
        });

        await auction.save();
      } catch (error) {
        AppLogger.error(
          `Something went wrong when update deliveryMethod in shippingRegistration method for auction #${auctionId}, error: ${error.message} `,
        );
        throw new AppError('Something went wrong. Please try again later');
      }
    }

    try {
      return await this.sendRequestForShippingRegistration(auction, deliveryMethod);
    } catch (error) {
      AppLogger.error(error.message);
      if (!deliveryMethod) throw new AppError(error.message);
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
    if (!auction) throw new AppError('Auction not found', ErrorCode.BAD_REQUEST);

    try {
      const { width, length, height, weight } = input;

      Object.assign(auction.delivery, {
        parcel: { width, length, height, weight },
      });
      Object.assign(auction, {
        updatedAt: this.timeNow(),
      });
      await auction.save();

      return { width, length, height, weight };
    } catch (error) {
      AppLogger.error(`Failed to update auction parcel for auction #${auctionId}, error: ${error.message}`);
      throw new AppError('Failed to update auction parcel. Please, try later');
    }
  }

  private async sendAuctionIsActivatedMessage(auction: IAuctionModel) {
    const currentAuction = await this.auctionRepository.getPopulatedAuction(auction);
    await this.sendNotificationForAuctionCharity(currentAuction);
    await this.sendNotificationsForCharityFollowers(currentAuction);
    await this.sendNotificationsForInfluencerFollowers(currentAuction);
  }

  private async sendNotificationForAuctionCharity(auction: IAuctionModel) {
    const charityUserAccount = await this.UserAccountModel.findById(auction.charity.userAccount).exec();
    if (!charityUserAccount) {
      AppLogger.error(`Cannot find account ${auction.charity.userAccount}`);
      return;
    }

    await this.notificationService.sendMessageLater(
      charityUserAccount.phoneNumber,
      MessageTemplate.AUCTION_IS_CREATED_MESSAGE,
      {
        auctionTitle: auction.title,
        auctionLink: ShortLinkService.makeLink({ slug: auction.shortLink.slug }),
      },
    );
  }

  private async sendNotificationsForCharityFollowers(auction: IAuctionModel) {
    const charityFollowers = auction.charity.followers;
    charityFollowers?.forEach(async (follower) => {
      await this.notificationService.sendMessageLater(
        follower.user.phoneNumber,
        MessageTemplate.AUCTION_IS_CREATED_MESSAGE_FOR_CHARITY_FOLLOWERS,
        {
          auctionLink: ShortLinkService.makeLink({ slug: auction.shortLink.slug }),
          charityName: auction.charity.name,
        },
      );
    });
  }

  private async sendNotificationsForInfluencerFollowers(auction: IAuctionModel) {
    const auctionOrganizerFollowers = auction.auctionOrganizer.followers;

    auctionOrganizerFollowers?.forEach(async (follower) => {
      await this.notificationService.sendMessageLater(
        follower.user.phoneNumber,
        MessageTemplate.AUCTION_IS_CREATED_MESSAGE_FOR_INFLUENCER_FOLLOWERS,
        {
          auctionLink: ShortLinkService.makeLink({ slug: auction.shortLink.slug }),
          influencerName: auction.auctionOrganizer.name,
        },
      );
    });
  }

  public async createDraftAuction(auctionOrganizerId: string, input: AuctionInput, isAdmin: boolean): Promise<Auction> {
    let auction = await this.auctionRepository.createAuction(auctionOrganizerId, input, isAdmin);
    return AuctionService.makeAuction(auction);
  }

  public async getCustomerInformation(stripeCustomerId: string): Promise<{ email: string; phone: string } | null> {
    try {
      const customer = (await this.stripeService.getCustomerInformation(stripeCustomerId)) as Stripe.Customer;

      return {
        email: customer.email,
        phone: customer.phone,
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
      items: items.map((item) => AuctionService.makeAuction(item)),
      size: items.length,
      skip: params.skip || 0,
    };
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
      return AuctionService.makeAuction(auction);
    } catch {}
  }

  public async getAuctionMetrics(auctionId: string): Promise<AuctionMetrics | {}> {
    const metricsModel = await this.AuctionMetricModel.findOne({ auction: auctionId });
    if (!metricsModel?.metrics?.length) return {};

    const auctionModel = await this.AuctionModel.findById(auctionId);
    const currentMetrics = metricsModel.toObject().metrics.map((metric) => getParsedMetric(metric));

    return {
      clicks: fullClicks(currentMetrics, auctionModel.startsAt, 'hour'),
      clicksByDay: fullClicks(currentMetrics, auctionModel.startsAt, 'day'),
      countries: getMetricByEntity(currentMetrics, 'country'),
      referrers: getMetricByEntity(currentMetrics, 'referrer'),
      browsers: getMetricByEntity(currentMetrics, 'browser'),
      oss: getMetricByEntity(currentMetrics, 'os'),
    };
  }

  public async updateOrCreateMetrics(
    shortLinkId: string,
    { referrer, country, userAgentData }: { referrer: string; country: string; userAgentData: string },
  ): Promise<{ id: string } | null> {
    const session = await this.connection.startSession();

    let returnObject;
    try {
      await session.withTransaction(async () => {
        const auctionModel = await this.AuctionModel.findOne({ shortLink: shortLinkId }, null, { session });
        if (!auctionModel) {
          returnObject = null;
          return;
        }

        const incomingMetric = { date: dayjs(), referrer, country, userAgentData };
        const auctionId = auctionModel._id.toString();

        const metricModel = await this.AuctionMetricModel.findOne({ auction: auctionId }, null, { session });

        if (metricModel) {
          const { metrics } = metricModel;

          Object.assign(metricModel, {
            metrics: [...metrics, incomingMetric],
          });

          await metricModel.save({ session });

          returnObject = { id: auctionId };
          return;
        }

        await this.AuctionMetricModel.create(
          [
            {
              auction: auctionId,
              metrics: [incomingMetric],
            },
          ],
          { session },
        );

        returnObject = { id: auctionId };
      });
      return returnObject;
    } catch (error) {
      AppLogger.error(
        `Something went wrong when try to update or create auction metrics for auction with shortLink #${shortLinkId}: ${error.message}`,
      );
    } finally {
      session.endSession();
    }
  }

  public async maybeActivateAuction(id: string, organizerId: string): Promise<Auction> {
    const auction = await this.auctionRepository.activateAuction(id, organizerId);

    if (auction.status === AuctionStatus.ACTIVE) await this.sendAuctionIsActivatedMessage(auction);

    return AuctionService.makeAuction(auction);
  }

  public async addAuctionAttachment(id: string, organizerId, input: AuctionAttachmentInput): Promise<AuctionAssets> {
    const auction = await this.auctionRepository.getAuction(id, organizerId);
    if (auction?.status !== AuctionStatus.DRAFT)
      throw new AppError('Auction does not exist or cannot be edited', ErrorCode.NOT_FOUND);

    try {
      const asset = await this.attachmentsService.uploadFileAttachment(
        id,
        auction.auctionOrganizer._id.toString(),
        input.file,
        input.uid,
        input.forCover,
      );
      await this.AuctionModel.updateOne({ _id: id }, { $addToSet: { assets: asset } });

      return AuctionService.makeAuctionAttachment(asset, input.filename ?? (await input.file).filename);
    } catch (error) {
      AppLogger.error(
        `Could not upload attachment for auction #${auction._id.toString()} with error: ${error.message}`,
      );
      throw new AppError('Could not upload this file. Please, try later', ErrorCode.BAD_REQUEST);
    }
  }

  public async getTotalRaisedAmount(charityId?: string, influencerId?: string): Promise<number> {
    const filters = { status: { $in: [AuctionStatus.SETTLED, AuctionStatus.SOLD] } };
    if (charityId) {
      filters['charity'] = charityId;
    }

    if (influencerId) {
      filters['auctionOrganizer'] = influencerId;
    }

    const auctions = await this.AuctionModel.find(filters);

    return AuctionService.makeTotalRaisedAmount(auctions);
  }

  public async updateAuction(id: string, userId: string, input: AuctionInput, isAdmin: boolean): Promise<Auction> {
    const { startPrice, bidStep, itemPrice, duration, fairMarketValue, items, ...rest } = objectTrimmer(input);

    const auction = await this.auctionRepository.updateAuction(
      id,
      userId,
      {
        ...(duration ? { startsAt: dayjs().second(0), endsAt: dayjs().second(0).add(duration, 'days') } : {}),
        ...(startPrice
          ? {
              startPrice: startPrice.getAmount(),
              currentPrice: startPrice.getAmount(),
              priceCurrency: startPrice.getCurrency(),
              itemPrice:
                itemPrice?.getAmount() ?? startPrice.getAmount() * 20 > AppConfig.bid.maxPriceValue * 100
                  ? AppConfig.bid.maxPriceValue * 100
                  : startPrice.getAmount() * 20,
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
              items: [],
            }
          : {}),
        ...(items
          ? {
              items: items.map(({ name, contributor, fairMarketValue }) => ({
                name,
                contributor,
                fairMarketValue: fairMarketValue.getAmount(),
              })),
              fairMarketValue: undefined,
            }
          : {}),
        ...(bidStep
          ? {
              bidStep: bidStep.getAmount(),
            }
          : {}),
        ...rest,
      },
      isAdmin,
    );
    return AuctionService.makeAuction(auction);
  }

  public async addAuctionBid(id: string, { bid, user }: ICreateAuctionBidInput & { user: UserAccount }): Promise<Bid> {
    const session = await this.connection.startSession();
    session.startTransaction();

    const card = await this.paymentService.getAccountPaymentInformation(user);
    if (!card) throw new AppError('Payment method is not provided');

    const auction = await this.AuctionModel.findById(id, null, { session }).exec();

    if (!auction.charity) throw new AppError('There is no charity attached to given auction');
    if (auction.status !== AuctionStatus.ACTIVE) throw new AppError('Auction is not active', ErrorCode.BAD_REQUEST);
    if (dayjs().utc().isAfter(auction.endsAt)) throw new AppError('Auction has already ended', ErrorCode.BAD_REQUEST);

    const currentPrice = Dinero({
      amount: auction.currentPrice,
      currency: (auction.priceCurrency || AppConfig.app.defaultCurrency) as Currency,
    });

    if (auction.totalBids > 0 && bid.lessThanOrEqual(currentPrice))
      throw new AppError(
        'Provided bid is lower, than maximum bid that was encountered on the auction',
        ErrorCode.BAD_REQUEST,
      );
    if (bid.getAmount() > AppConfig.bid.maxPriceValue) throw new AppError('Unable to charge', ErrorCode.BAD_REQUEST);

    try {
      const [lastBid] = await this.BidModel.find({ auction: auction._id }, null, { session })
        .sort({ bid: -1 })
        .limit(1);

      const bidInput = {
        user: user.mongodbId,
        auction: auction._id,
        bid: bid.getAmount(),
        bidCurrency: (bid.getCurrency() ?? AppConfig.app.defaultCurrency) as Dinero.Currency,
        chargeId: null,
      };

      const createdBid = await this.bidService.createBid(bidInput, session);

      Object.assign(auction, {
        updatedAt: this.timeNow(),
        currentPrice: bid.getAmount(),
        totalBids: auction.totalBids + 1,
      });

      await auction.save({ session });
      await session.commitTransaction();

      if (lastBid && lastBid.user.toString() !== user.mongodbId) {
        try {
          const userAccount = await this.UserAccountModel.findById(lastBid.user);
          if (!userAccount) throw new AppError(`Cannot find user with #${lastBid.user}`);

          const currentAuction = await this.auctionRepository.getPopulatedAuction(auction);
          await this.notificationService.sendMessageLater(
            userAccount.phoneNumber,
            MessageTemplate.AUCTION_BID_OVERLAP,
            {
              auctionTitle: currentAuction.title,
              auctionLink: ShortLinkService.makeLink({ slug: currentAuction.shortLink.slug }),
            },
          );
        } catch (error) {
          AppLogger.error(`Failed to send notification for auction #${id}, error: ${error.message}`);
        }
      }

      return createdBid;
    } catch (error) {
      await session.abortTransaction();
      AppLogger.error(`Something went wrong when adding auction bid for auction #${id}, error: ${error.message}`);
      throw new AppError('Something went wrong. Please, try again later');
    } finally {
      session.endSession();
    }
  }

  public async scheduleAuctionJobSettle(): Promise<void> {
    const auctions = await this.AuctionModel.find({ status: AuctionStatus.ACTIVE });

    for await (const auction of auctions) {
      if (dayjs().utc().isAfter(auction.endsAt)) {
        try {
          await this.settleAuctionAndCharge(auction);
        } catch {}
      }
    }
  }

  public async scheduleAuctionEndsNotification(): Promise<void> {
    const auctions = await this.AuctionModel.find({ status: AuctionStatus.ACTIVE });

    for await (const auction of auctions) {
      await this.sendFirstNotificationForUsers(auction);
      await this.sendLastNotificationForUsers(auction);
      await this.sendNotificationForAuctionOrganizer(auction);
    }
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
    )
      return;

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
      dayjs(auction.endsAt).diff(auction.startsAt, 'hour') <= 24 ||
      auction.sentNotifications.includes('notificationForAuctionOrganizer')
    )
      return;

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
    const phoneNumber = currentAuction.auctionOrganizer?.userAccount?.phoneNumber;

    if (!phoneNumber) return null;

    await this.notificationService.sendMessageLater(
      phoneNumber,
      MessageTemplate.AUCTION_ENDS_MESSAGE_FOR_AUCTIONORGANIZER,
      {
        auctionTitle: currentAuction.title,
        auctionPrice: Dinero({
          amount: currentAuction.currentPrice,
          currency: currentAuction.priceCurrency as Currency,
        }).toFormat('$0,0'),
        shortUrl: ShortLinkService.makeLink({ slug: currentAuction.shortLink.slug }),
      },
    );
  }

  private async notifyUsers(auction: IAuctionModel, timeLeftText: string): Promise<void> {
    if (!auction) throw new Error(`There is no auction for sending notification`);

    const currentAuction = await this.auctionRepository.getPopulatedAuction(auction);
    const followerIds = currentAuction.followers.map((follower) => follower.user);
    const followerUsers = await this.UserAccountModel.find({ _id: followerIds }).exec();
    const followersPhonenumber = followerUsers.map((user) => user.phoneNumber);
    const bidModels = await this.bidService.populatedBids(auction._id);
    const bidsUserPhonenumber = bidModels.map((bid) => bid.user.phoneNumber);
    const phoneNumbers = new Set([...followersPhonenumber, ...bidsUserPhonenumber]);

    phoneNumbers.forEach(async (phoneNumber) => {
      try {
        await this.notificationService.sendMessageLater(phoneNumber, MessageTemplate.AUCTION_ENDS_MESSAGE_FOR_USERS, {
          timeLeftText,
          influencerName: currentAuction.auctionOrganizer.name,
          auctionName: currentAuction.title,
          auctionLink: ShortLinkService.makeLink({ slug: currentAuction.shortLink.slug }),
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

  public async getInfluencersAuctions(id: string): Promise<Auction[]> {
    const auctions = await this.auctionRepository.getInfluencersAuctions(id);
    return auctions.map((auction) => AuctionService.makeAuction(auction));
  }

  public async settleAndChargeCurrentAuction(id: string): Promise<void> {
    const auction = await this.AuctionModel.findOne({ _id: id });
    if (auction.status !== AuctionStatus.ACTIVE) {
      Object.assign(auction, {
        updatedAt: this.timeNow(),
        status: AuctionStatus.ACTIVE,
      });
      await auction.save();
    }
    return await this.settleAuctionAndCharge(auction);
  }

  public async chargeCurrendBid(input): Promise<string> {
    const { user, bid, charityId, charityStripeAccountId, auctionTitle } = input;
    const { id: cardId } = await this.paymentService.getAccountPaymentInformation(user);

    if (!cardId) {
      AppLogger.error(`Can not find payment information for user #${user._id.toString()} in chargeCurrendBid method`);
      throw new AppError('Something went wrong. Please try again later');
    }

    return await this.paymentService.chargeUser(
      user,
      cardId,
      bid,
      `Contrib auction: ${auctionTitle}`,
      charityStripeAccountId,
      charityId,
    );
  }

  public async settleAuctionAndCharge(auction: IAuctionModel): Promise<void> {
    if (!auction) throw new AppError('Auction not found');
    if (!auction.charity) throw new AppError('There is no charity attached to given auction');
    if (auction.status !== AuctionStatus.ACTIVE) throw new AppError('Auction status is not ACTIVE');

    const [lastAuctionBid] = await this.BidModel.find({ auction: auction._id }).sort({ bid: -1 }).limit(1);

    if (!lastAuctionBid) {
      Object.assign(auction, {
        updatedAt: this.timeNow(),
        status: AuctionStatus.SETTLED,
      });
      await auction.save();
      return;
    }

    try {
      await lastAuctionBid.populate({ path: 'user', model: this.UserAccountModel });
      lastAuctionBid.chargeId = await this.chargeUser(lastAuctionBid, auction);

      const { messageTemplate, messageVariables } = await this.getMessageTemplateAndVariables(
        AppConfig.delivery.UPSSMSWithDeliveryLink,
        auction,
        'WON',
      );

      await this.notificationService.sendMessageLater(
        lastAuctionBid.user.phoneNumber,
        messageTemplate,
        messageVariables,
      );

      AppLogger.info(
        `Auction with id ${auction.id} has been settled with charge id ${
          lastAuctionBid.chargeId
        } and user id ${lastAuctionBid.user._id.toString()}`,
      );

      const currentAuction = await auction.populate([
        { path: 'auctionOrganizer', model: this.InfluencerModel },
        { path: 'charity', model: this.CharityModel },
      ]);

      await this.updateTotalRaisedAmount(currentAuction, lastAuctionBid.bid);

      Object.assign(auction, {
        updatedAt: this.timeNow(),
        winner: lastAuctionBid.user._id.toString(),
        status: AuctionStatus.SETTLED,
      });

      await await lastAuctionBid.save();
      await auction.save();
    } catch (error) {
      AppLogger.error(`Unable to charge user ${lastAuctionBid.user._id.toString()}, with error: ${error.message}`);
      Object.assign(auction, {
        updatedAt: this.timeNow(),
        status: AuctionStatus.FAILED,
      });
      await auction.save();
      throw new AppError('Unable to charge');
    }
  }

  async chargeUser(lastAuctionBid: IBidModel, auction: IAuctionModel): Promise<string> {
    const charityAccount = await this.CharityModel.findOne({ _id: auction.charity }).exec();
    if (!charityAccount) throw new Error(`Can not find charity account with id ${auction.charity.toString()}`);

    const user = lastAuctionBid.user;
    const { id: cardId } = await this.paymentService.getAccountPaymentInformation(user);

    if (!cardId) {
      AppLogger.error(`Can not find payment information for user #${user._id.toString()} in chargeUser method`);
      throw new AppError('Something went wrong. Please try again later');
    }

    return await this.paymentService.chargeUser(
      lastAuctionBid.user,
      cardId,
      this.makeBidDineroValue(lastAuctionBid.bid, lastAuctionBid.bidCurrency),
      `Contrib auction: ${auction.title}`,
      charityAccount.stripeAccountId,
      auction.charity.toString(),
    );
  }

  private makeBidDineroValue(amount: number, currency: string) {
    return Dinero({ amount: amount, currency: currency as Dinero.Currency });
  }

  public async activateAuction(auction: IAuctionModel): Promise<void> {
    if (!auction) throw new AppError('Auction not found');

    Object.assign(auction, {
      updatedAt: this.timeNow(),
      status: AuctionStatus.ACTIVE,
    });

    await auction.save();
    await this.sendAuctionIsActivatedMessage(auction);

    return;
  }

  private static makeAuctionAttachment(model: IAuctionAssetModel, filename?: string): AuctionAssets | null {
    if (!model) return null;

    const { _id, uid, __v, ...rest } = 'toObject' in model ? model.toObject() : model;

    return {
      uid,
      id: _id.toString(),
      cloudflareUrl: uid ? CloudflareStreaming.getVideoStreamUrl(uid) : null,
      thumbnail: uid ? CloudflareStreaming.getVideoPreviewUrl(uid) : null,
      originalFileName: filename,
      ...rest,
    };
  }

  public static makeTotalRaisedAmount(auctions: IAuctionModel[]): number {
    if (!auctions) return 0;

    return auctions.map((auction) => auction.currentPrice ?? 0).reduce((total, next) => (total += next), 0);
  }

  public async buyAuction(id: string, user: UserAccount): Promise<Auction> {
    const auction = await this.auctionRepository.getAuction(id);

    if (!auction) throw new AppError('Auction not found', ErrorCode.BAD_REQUEST);
    if (!auction.charity) throw new AppError('There is no charity attached to given auction');
    if (auction.status !== AuctionStatus.ACTIVE) throw new AppError('Auction is not active', ErrorCode.BAD_REQUEST);
    if (auction.currentPrice > auction.itemPrice)
      throw new AppError('Auction has larger current price', ErrorCode.BAD_REQUEST);

    const card = await this.paymentService.getAccountPaymentInformation(user);
    if (!card) throw new AppError('Payment method is not provided');

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
        chargeId,
      };

      await this.bidService.createBid(bidInput);
    } catch (error) {
      AppLogger.error(`Unable to charge auction #${auction.id}: ${error.message}`);
      throw new AppError('Unable to charge');
    }

    try {
      await this.updateTotalRaisedAmount(auction, auction.itemPrice);
    } catch (error) {
      AppLogger.error(
        `Something went wrong during totalRaisedAmount update when buy auction #${auction.id}: ${error.message}`,
      );
      throw new AppError('Unable to charge');
    }

    AppLogger.info(`Auction with id ${auction.id} has been sold`);

    Object.assign(auction, {
      updatedAt: this.timeNow(),
      winner: user.mongodbId,
      status: AuctionStatus.SOLD,
      currentPrice: auction.itemPrice,
      stoppedAt: this.timeNow(),
    });

    try {
      await auction.save();
    } catch (error) {
      AppLogger.error(`Something went wrong during auction update when buy auction #${auction.id}: ${error.message}`);
      throw new AppError('Something went wrong. Please, try again later');
    }

    try {
      const messageData = await this.getMessageTemplateAndVariables(
        AppConfig.delivery.UPSSMSWithDeliveryLink,
        auction,
        'BOUGHT',
      );
      const { messageTemplate, messageVariables } = messageData;

      await this.notificationService.sendMessageLater(user.phoneNumber, messageTemplate, messageVariables);
    } catch (error) {
      AppLogger.error(`Something went wrong when send bought notification for auction #${id}, error: ${error.message}`);
      throw new AppError('Something went wrong. Please, try again later', ErrorCode.BAD_REQUEST);
    }
    return AuctionService.makeAuction(auction);
  }

  public async stopAuction(id: string): Promise<Auction> {
    const auction = await this.auctionRepository.getAuction(id);

    Object.assign(auction, {
      updatedAt: this.timeNow(),
      status: AuctionStatus.STOPPED,
      stoppedAt: this.timeNow(),
    });

    try {
      await auction.save();
    } catch (error) {
      throw new AppError('Something went wrong', ErrorCode.BAD_REQUEST);
    }
    return AuctionService.makeAuction(auction);
  }
  public async activateAuctionById(id: string): Promise<Auction> {
    const auction = await this.auctionRepository.getAuction(id);

    Object.assign(auction, {
      updatedAt: this.timeNow(),
      stoppedAt: this.timeNow(),
      status: auction.endsAt < dayjs() ? AuctionStatus.SETTLED : AuctionStatus.ACTIVE,
    });

    try {
      await auction.save();
    } catch (error) {
      throw new AppError(`Something went wrong, ${error.message}`, ErrorCode.BAD_REQUEST);
    }

    if (auction.status === AuctionStatus.ACTIVE) await this.sendAuctionIsActivatedMessage(auction);
    return AuctionService.makeAuction(auction);
  }

  private async deleteAttachmentFromCloud(url: string | undefined, uid: string | undefined): Promise<void> {
    if (uid) {
      const cloudflareStreaming = new CloudflareStreaming();
      await cloudflareStreaming.deleteFromCloudFlare(uid);
    }
    if (url) await this.attachmentsService.removeFileAttachment(url);
  }

  public async deleteAuctionAttachment(
    auctionId: string,
    organizerId: string,
    attachmentId: string,
  ): Promise<AuctionAssets> {
    const auction = await this.auctionRepository.getAuction(auctionId, organizerId);
    if (!auction) throw new AppError('Auction not found', ErrorCode.NOT_FOUND);

    const attachment = await this.attachmentsService.AuctionAsset.findById(attachmentId);
    if (!attachment) throw new AppError('Attachment not found', ErrorCode.NOT_FOUND);

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
    if (!auction) throw new AppError('Can not find auction', ErrorCode.NOT_FOUND);
    if (auction.status !== AuctionStatus.DRAFT) throw new AppError('Auction is not DRAFT', ErrorCode.BAD_REQUEST);

    try {
      auction.assets.forEach(async (assetId) => await this.deleteAuctionAttachmentById(assetId));
      await this.AuctionModel.deleteOne({ _id: auctionId });
    } catch (error) {
      AppLogger.error(`Cannot delete auction #${auction.id}: ${error.message}`);
      throw new AppError('Cannot delete auction', ErrorCode.BAD_REQUEST);
    }
  }

  public async getMessageTemplateAndVariables(enviroment: boolean, auction: IAuctionModel, type: string) {
    const populatedAuction = await this.auctionRepository.getPopulatedAuction(auction);
    const messageVariables: { auctionTitle: string; auctionLink: string; auctionDeliveryLink?: string } = {
      auctionTitle: auction.title,
      auctionLink: ShortLinkService.makeLink({ slug: populatedAuction.shortLink.slug }),
    };

    if (enviroment) {
      const deliveryShortLink = await this.shortLinkService.createShortLink({
        address: `auctions/${auction._id.toString()}/delivery/address`,
      });

      messageVariables.auctionDeliveryLink = ShortLinkService.makeLink({ slug: deliveryShortLink.slug });
    }

    return {
      messageVariables,
      messageTemplate: enviroment
        ? MessageTemplate[`AUCTION_${type}_MESSAGE_WITH_DELIVERY_LINK`]
        : MessageTemplate[`AUCTION_${type}_MESSAGE`],
    };
  }

  private timeNow = () => dayjs().second(0);

  public static makeAuctionWinner(winner) {
    const { _id, ...rest } = winner;

    return {
      mongodbId: _id.toString(),
      ...rest,
    };
  }

  private static makeAssets(assets: any[]): AuctionAssets[] {
    return assets
      .map((asset) => AuctionService.makeAuctionAttachment(asset))
      .sort((a, b) => {
        if (a.forCover) return -1;
        if (b.type > a.type) return -1;
      });
  }

  public static makeAuction(model: IAuctionModel): Auction | null {
    const {
      _id,
      assets,
      status,
      itemPrice,
      currentPrice,
      startPrice,
      bidStep,
      priceCurrency,
      fairMarketValue,
      items,
      followers,
      winner,
      shortLink,
      ...rest
    } = 'toObject' in model ? model.toObject() : model;

    const currency = (priceCurrency ?? AppConfig.app.defaultCurrency) as Dinero.Currency;
    const charity = Array.isArray(model.charity) ? model.charity[0] : model.charity;
    const auctionOrganizer = Array.isArray(model.auctionOrganizer) ? model.auctionOrganizer[0] : model.auctionOrganizer;
    const isSettled = status === AuctionStatus.SETTLED || dayjs().utc().isAfter(model.endsAt);

    return {
      ...rest,
      id: _id.toString(),
      attachments: AuctionService.makeAssets(assets),
      charity: charity && charity !== Object(charity) ? CharityService.makeCharity(charity) : null,
      currentPrice: Dinero({ currency, amount: currentPrice }),
      startPrice: Dinero({ currency, amount: startPrice }),
      bidStep: Dinero({ currency, amount: bidStep }),
      itemPrice: itemPrice || itemPrice === 0 ? Dinero({ currency, amount: itemPrice }) : null,
      fairMarketValue: fairMarketValue ? Dinero({ currency, amount: fairMarketValue }) : null,
      items: items?.map(({ _id, name, contributor, fairMarketValue }) => ({
        id: _id.toString(),
        name,
        contributor,
        fairMarketValue: Dinero({ currency, amount: fairMarketValue }),
      })),
      auctionOrganizer: InfluencerService.makeInfluencerProfile(auctionOrganizer),
      followers: followers.map((follower) => {
        return {
          user: follower.user,
          createdAt: follower.createdAt,
        };
      }),
      winner: winner ? AuctionService.makeAuctionWinner(winner) : null,
      shortLink: ShortLinkService.makeShortLink(shortLink),
      status,
      isActive: status === AuctionStatus.ACTIVE && !isSettled,
      isDraft: status === AuctionStatus.DRAFT,
      isSettled,
      isFailed: status === AuctionStatus.FAILED,
      isSold: status === AuctionStatus.SOLD,
      isStopped: status === AuctionStatus.STOPPED,
    };
  }
}
