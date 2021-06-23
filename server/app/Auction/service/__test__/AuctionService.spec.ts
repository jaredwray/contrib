import { Connection } from 'mongoose';
import Dinero from 'dinero.js';

import { AuctionService } from '../AuctionService';
import { UrlShortenerService } from '../../../Core';
import { PaymentService, StripeService } from '../../../Payment';
import { UserAccountService } from '../../../UserAccount';
import { TwilioVerificationService } from '../../../../twilio-client';
import { EventHub } from '../../../EventHub';
import { Auth0Service } from '../../../../authz';
import { TestPaymentService } from './TestPaymentService';
import { AuctionStatus } from '../../dto/AuctionStatus';
import { InfluencerModel } from '../../../Influencer/mongodb/InfluencerModel';
import { AuctionOrderBy } from '../../dto/AuctionOrderBy';
import { AuctionRepository } from '../../repository/AuctionRepository';
import GCloudStorage from '../../../../__mocks__/GCloudStorage';
import CloudflareStreamingMock from '../../../../__mocks__/CloudflareStreamingMock';
import { initInMemoryMongodbConnection } from '../../../../mongodb';
import { IGCloudStorage } from '../../../IGCloudStorage';
import { IHandlebarsService } from '../../../Message/service/HandlebarsService';
import HanlebarsServiceMock from '../../../../__mocks__/HanlebarsServiceMock';
import { ICloudTaskService } from '../../../ICloudTaskSerivce';
import CloudTaskServiceMock from '../../../../__mocks__/CloudTaskServiceMock';

const auctionRepoInput = {
  title: 'test-auction',
  startPrice: Dinero({ amount: 150, currency: 'USD', precision: 2 }),
  startPriceCurrency: 'USD',
  sport: 'hockey',
  fullPageDescription: 'Hockey stick',
  autographed: true,
};

const updateSportInput = {
  sport: 'hockey',
};

const mockedInfluencer = {
  name: 'test-influencer name',
  avatarUrl: 'test url',
  status: 'test status',
};

describe('AuctionService', () => {
  let connection: Connection;
  let payment: PaymentService;
  let cloudStorage: IGCloudStorage;
  let urlShortener: UrlShortenerService;
  let auctionService: AuctionService;
  let InfluencerMod;
  let testInfluencer;
  let testInfluencerId;
  let testAuction;
  let testAuctionId;
  let auctionRepo;
  let handlebarsService: IHandlebarsService;
  let cloudTaskService: ICloudTaskService;

  beforeAll(async () => {
    connection = await initInMemoryMongodbConnection();
    const cloudflareStreaming = new CloudflareStreamingMock();
    cloudStorage = new GCloudStorage(cloudflareStreaming);
    const eventHub = new EventHub();
    urlShortener = new UrlShortenerService();
    const stripe = new StripeService();
    const auth0 = new Auth0Service();
    const twilioVerification = new TwilioVerificationService();
    const userAccount = new UserAccountService(connection, twilioVerification, eventHub);
    payment = new TestPaymentService(userAccount, stripe, auth0);
    handlebarsService = new HanlebarsServiceMock();
    cloudTaskService = new CloudTaskServiceMock();
    auctionService = new AuctionService(
      connection,
      payment,
      cloudStorage,
      urlShortener,
      cloudTaskService,
      handlebarsService,
    );
  });

  it('auction service should be created', async () => {
    auctionService = new AuctionService(
      connection,
      payment,
      cloudStorage,
      urlShortener,
      cloudTaskService,
      handlebarsService,
    );
    expect(auctionService).toBeDefined();
  });

  it('should create auctionDraft with DRAFT status using InfluencerID', async () => {
    InfluencerMod = await InfluencerModel(connection);
    testInfluencer = new InfluencerMod(mockedInfluencer);
    await testInfluencer.save();
    testInfluencerId = testInfluencer.id.toString();
    const auctionDraft = await auctionService.createAuctionDraft(testInfluencerId, auctionRepoInput);
    expect(auctionDraft.status).toEqual(AuctionStatus.DRAFT);
  });

  it.skip('should count auctions with query and filters', async () => {
    const mockedFilters = {
      query: `query`,
      size: 15,
      skip: 0,
      orderBy: AuctionOrderBy.SPORT,
      statusFilter: [AuctionStatus.ACTIVE, AuctionStatus.SETTLED, AuctionStatus.SOLD, AuctionStatus.PENDING],
      filters: {
        sports: ['string'],
        minPrice: 1,
        maxPrice: 200,
        auctionOrganizer: testInfluencerId,
      },
    };
    const count = await auctionService.listAuctions(mockedFilters);
    expect(count.size).toEqual(mockedFilters.size);
  });

  it('should get auction', async () => {
    auctionRepo = new AuctionRepository(connection);
    testAuction = await auctionRepo.createAuction(testInfluencerId, auctionRepoInput);
    testAuctionId = testAuction.id.toString();
    const auction = await auctionService.getAuction(testAuctionId);
    expect(auction).toBeDefined();
  });

  it('should update auction', async () => {
    const result = await auctionService.updateAuction(testAuctionId, testInfluencerId, updateSportInput);
    expect(result.sport).toEqual(updateSportInput.sport);
  });

  it.skip('should get field sport from auction', async () => {
    const sports = await auctionService.listSports();
    expect(sports).toEqual([auctionRepoInput.sport]);
  });

  it('should be able to get price limits', async () => {
    const result = await auctionService.getAuctionPriceLimits();
    expect(typeof result.min).toBe('object');
    expect(typeof result.max).toBe('object');
  });

  it('should return influecer auctions', async () => {
    const result = await auctionService.getInfluencersAuctions(testInfluencerId);
    expect(Boolean(result.length)).toEqual(true);
  });
});
