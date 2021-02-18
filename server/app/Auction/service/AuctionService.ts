import { Connection } from 'mongoose';
import { AuctionModel } from '../mongodb/AuctionModel';
import { AuctionAttachmentsService } from './AuctionAttachmentsService';

export class AuctionService {
  private readonly AuctionModel = AuctionModel(this.connection);
  private readonly attachmentsService = new AuctionAttachmentsService();
  constructor(private readonly connection: Connection) {}
}
