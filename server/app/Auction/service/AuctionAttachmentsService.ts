import { Connection } from 'mongoose';
import { v4 as getUuid } from 'uuid';

import { AuctionAssetModel, IAuctionAssetModel } from '../mongodb/AuctionAssetModel';
import { GCloudStorage, IFile } from '../../GCloudStorage';
import { AppError, ErrorCode } from '../../../errors';
import { AppLogger } from '../../../logger';

export class AuctionAttachmentsService {
  public readonly AuctionAsset = AuctionAssetModel(this.connection);

  constructor(private readonly connection: Connection, private readonly cloudStorage: GCloudStorage) {}

  public async uploadFileAttachment(
    auctionId: string,
    organizerId: string,
    attachment: Promise<IFile>,
  ): Promise<IAuctionAssetModel> {
    const uuid = getUuid();
    const attachmentPath = `${organizerId}/auctions/${auctionId}/${uuid}/${uuid}`;
    try {
      const { fileType, url, uid } = await this.cloudStorage.uploadFile(attachment, { fileName: attachmentPath });
      const assetUid = Boolean(uid) ? { uid } : {};
      const asset = new this.AuctionAsset({ url, type: fileType, ...assetUid });
      await asset.save();
      return asset;
    } catch (error) {
      AppLogger.error(`Something went wrong during upload attachment for auction #${auctionId}: ${error.message}`);
      throw new AppError(`Something went wrong. Please, try later`, ErrorCode.INTERNAL_ERROR);
    }
  }

  public async removeFileAttachment(attachmentUrl: string): Promise<void> {
    try {
      await this.cloudStorage.removeFile(attachmentUrl);
    } catch (error) {
      AppLogger.error(`Something went wrong during delete attachment with url ${attachmentUrl}: ${error.message}`);
      throw new AppError(`Something went wrong. Please, try later`, ErrorCode.INTERNAL_ERROR);
    }
  }
}
