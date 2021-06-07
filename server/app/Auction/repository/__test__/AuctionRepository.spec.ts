import { Connection, Model } from 'mongoose';
import Dinero from 'dinero.js';

import { initMongodbInMemoryConnection, mongodbDisconnect } from '../../../../mongodb/initMongodbInMemoryConnection';
import { AuctionAssetModel, IAuctionAssetModel } from '../../mongodb/AuctionAssetModel';
import { AuctionOrderBy } from '../../dto/AuctionOrderBy';
import { AssetType } from '../../dto/AuctionAssets';
import { IAuctionRepository } from '../IAuctionRepoository';
import { IAuctionModel } from '../../mongodb/AuctionModel';
import { AuctionRepository } from '../AuctionRepository';
import { AuctionStatus } from '../../dto/AuctionStatus';
import { AppError, ErrorCode } from '../../../../errors';

const auctionRepoInput = {
  title: 'test-auction',
  startPrice: Dinero({ amount: 150, currency: 'USD', precision: 2 }),
  startPriceCurrency: 'USD',
  sport: 'hockey',
  fullPageDescription: 'Hockey stick',
  autographed: true,
};

const errorAuction = {
  status: 'MOCKEDSTATUS',
  sport: 'hockey',
};

describe('AuctionRepository', () => {
  let connection: Connection;
  let auctionRepo: IAuctionRepository;
  let createdAuction: IAuctionModel;
  const testInfluencerId = process.env.TEST_INFLUENCER_ID;

  beforeAll(async () => {
    connection = await initMongodbInMemoryConnection();
    auctionRepo = new AuctionRepository(connection);
  });

  afterAll(async () => {
    await mongodbDisconnect();
  });

  it('should init repository with MongoDB connection', () => {
    const auctionRepo = new AuctionRepository(connection);
    expect(auctionRepo).toBeDefined();
  });

  it('should get an error when it is no auctions to get max/min startrice', async () => {
    try {
      await auctionRepo.getAuctionPriceLimits();
    } catch (e) {
      expect(e.code).toEqual(ErrorCode.NOT_FOUND);
    }
  });

  it('should create auction with draft state and get it by _id', async () => {
    createdAuction = await auctionRepo.createAuction(testInfluencerId, auctionRepoInput);
    expect(createdAuction.status).toEqual(AuctionStatus.DRAFT);
  });

  it('should create and get auction', async () => {
    const current = await auctionRepo.getAuction(createdAuction.id.toString(), testInfluencerId);
    expect(current.toObject()).toBeDefined();
  });

  it('should update auction', async () => {
    const title = 'Update test action';
    const updated = await auctionRepo.updateAuction(createdAuction.id.toString(), testInfluencerId, {
      ...auctionRepoInput,
      startPrice: auctionRepoInput.startPrice.getAmount(),
      title,
    });
    expect(updated.title).toEqual(title);
  });

  it('error', async () => {
    try {
      await auctionRepo.updateAuction(createdAuction.id.toString(), testInfluencerId, {
        ...auctionRepoInput,
        startPrice: auctionRepoInput.startPrice.getAmount(),
      });
    } catch (e) {
      expect(e.code).toEqual(ErrorCode.NOT_FOUND);
    }
  });

  it('should update an auction status', async () => {
    const updated = await auctionRepo.changeAuctionStatus(
      createdAuction.id.toString(),
      testInfluencerId,
      AuctionStatus.ACTIVE,
    );
    expect(updated.status).toEqual(AuctionStatus.ACTIVE);
  });

  it('should fail status change', async () => {
    try {
      await auctionRepo.changeAuctionStatus(createdAuction.id.toString(), testInfluencerId, AuctionStatus.DRAFT);
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
    }
  });

  it('should fetch auction list of 15 items', async () => {
    const size = 15;
    const result = await auctionRepo.getAuctions({ size, skip: 0 });
    expect(result).toBeDefined();
    expect(result.length).toBeLessThanOrEqual(size);
  });

  it('should be able to get price limits', async () => {
    const res = await auctionRepo.getAuctionPriceLimits();
    expect(typeof res.min).toBe('number');
    expect(typeof res.max).toBe('number');
  });

  it('should update an auction link', async () => {
    const updated = await auctionRepo.updateAuctionLink(createdAuction.id.toString(), 'link');
    expect(updated.link).toEqual('link');
  });

  it('should return influencer auctions', async () => {
    const numberOfAuctions = await auctionRepo.getInfluencersAuctions(testInfluencerId);
    expect(numberOfAuctions.length).toBeDefined();
  });

  it('should get an error when creating auction without title', async () => {
    try {
      await auctionRepo.createAuction(testInfluencerId, errorAuction);
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
    }
  });

  it('should get error when update auction with not DRAFT status', async () => {
    try {
      await auctionRepo.updateAuction(createdAuction.id.toString(), testInfluencerId, {
        ...errorAuction,
        sport: 'test sport',
      });
    } catch (e) {
      expect(e.code).toEqual(ErrorCode.BAD_REQUEST);
    }
  });

  it('should count auctions with query', async () => {
    const mockedValue = {
      query: `query`,
      filters: {
        sports: ['string'],
        minPrice: 1,
        maxPrice: 2,
        auctionOrganizer: testInfluencerId,
      },
    };
    const count = await auctionRepo.countAuctions(mockedValue);
    expect(count).toEqual(0);
  });

  it('should count auctions with query and filters', async () => {
    const mockedValue = {
      query: `query`,
      size: 15,
      skip: 0,
      orderBy: AuctionOrderBy.SPORT,
      filters: {
        sports: ['string'],
        minPrice: 1,
        maxPrice: 200,
        auctionOrganizer: testInfluencerId,
      },
    };
    const count = await auctionRepo.getAuctionsCount(mockedValue);
    expect(count).toEqual(0);
  });

  it('should get field sport from auction', async () => {
    const result = await auctionRepo.getAuctionSports();
    expect(result).toEqual([auctionRepoInput.sport]);
  });

  it('should insert transmitted asset and return it', async () => {
    const AuctionModel: Model<IAuctionAssetModel> = AuctionAssetModel(connection);
    const paramsAsset = {
      type: AssetType.VIDEO,
      url: 'awdawd',
    };
    const asset: IAuctionAssetModel = new AuctionModel(paramsAsset);
    const insertedAsset = await auctionRepo.addAuctionAttachment(createdAuction.id.toString(), testInfluencerId, asset);
    expect(insertedAsset).toEqual(asset);
  });
});
