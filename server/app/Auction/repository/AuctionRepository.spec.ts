import '../../../__mocks__/dayjs';
import * as path from 'path';
import { config as loadDotEnvFile } from 'dotenv';
loadDotEnvFile({ path: path.resolve(__dirname, '../../../.env') });

import { Connection } from 'mongoose';
import { AuctionRepository } from './AuctionRepository';
import { AuctionStatus } from '../dto/AuctionStatus';
import { IAuctionRepository } from './IAuctionRepoository';
import { IAuctionModel } from '../mongodb/AuctionModel';
import { AppError } from '../../../errors/AppError';
import { initMongodbConnection } from '../../../mongodb';
import { requireEnvVar } from '../../../config';

const auctionRepoInput = {
  title: 'test-auction',
  startPrice: 150,
  startPriceCurrency: 'USD',
  sport: 'hockey',
  fullPageDescription: 'Hockey stick',
  autographed: true,
};

describe('AuctionRepository', () => {
  let connection: Connection;
  let auctionRepo: IAuctionRepository;
  let createdAuction: IAuctionModel;
  const testInfluencerId = requireEnvVar('TEST_INFLUENCER_ID');

  beforeAll(async () => {
    connection = await initMongodbConnection();
    auctionRepo = new AuctionRepository(connection);
  });
  afterAll(() => {
    connection.close();
  });

  it('should init repository with MongoDB connection', () => {
    const auctionRepo = new AuctionRepository(connection);
    expect(auctionRepo).toBeDefined();
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
      title,
    });
    expect(updated.title).toEqual(title);
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
});
