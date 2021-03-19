import { Connection } from 'mongoose';
import { AuctionRepository } from './Auction/repository/AuctionRepository';
import { IAuctionRepository } from './Auction/repository/IAuctionRepoository';

export type IAppRepositories = {
  auctionRepository: IAuctionRepository;
};

export const createAppRepositories = (connection: Connection): IAppRepositories => {
  const auctionRepository = new AuctionRepository(connection);

  return {
    auctionRepository,
  };
};
