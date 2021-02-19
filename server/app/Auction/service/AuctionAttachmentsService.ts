import { AuctionAssetModel } from '../mongodb/AuctionAssetModel';
import { Connection } from 'mongoose';

export class AuctionAttachmentsService {
  public readonly AuctionAsset = AuctionAssetModel(this.connection);
  constructor(private readonly connection: Connection) {}
}
