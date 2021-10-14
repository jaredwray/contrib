import { Connection } from 'mongoose';
import { v4 as getUuid } from 'uuid';
import axios from 'axios';

import { AuctionAssetModel, IAuctionAssetModel } from '../mongodb/AuctionAssetModel';
import { GCloudStorage, IFile } from '../../GCloudStorage';
import { AppError, ErrorCode } from '../../../errors';
import { AppLogger } from '../../../logger';
import { AppConfig } from '../../../config';

export class AuctionAttachmentsService {
  public readonly AuctionAsset = AuctionAssetModel(this.connection);

  constructor(private readonly connection: Connection, private readonly cloudStorage: GCloudStorage) {}

  public async uploadFileAttachment(
    auctionId: string,
    organizerId: string,
    attachment: Promise<IFile> | null,
    uid: string | null,
  ): Promise<IAuctionAssetModel> {
    try {
      const assetOptions = await this.auctionAssetOptions(auctionId, organizerId, attachment, uid);
      const asset = new this.AuctionAsset(assetOptions);
      await asset.save();
      return asset;
    } catch (error) {
      AppLogger.error(`Something went wrong during upload attachment for auction #${auctionId}: ${error.message}`);
      throw new AppError(`Something went wrong. Please, try later`, ErrorCode.INTERNAL_ERROR);
    }
  }

  private async auctionAssetOptions(
    auctionId: string,
    organizerId: string,
    attachment: Promise<IFile> | null,
    uid: string,
  ): Promise<{ url: string | undefined; type: string; uid: string | undefined }> {
    if (uid) {
      return { url: undefined, type: 'VIDEO', uid };
    } else {
      return await this.uploadAttachment(auctionId, organizerId, attachment);
    }
  }

  private async uploadAttachment(
    auctionId: string,
    organizerId: string,
    attachment: Promise<IFile> | null,
  ): Promise<{ url: string; type: string; uid: undefined }> {
    const uuid = getUuid();
    const attachmentPath = `${organizerId}/auctions/${auctionId}/${uuid}/${uuid}`;
    const { fileType, url } = await this.cloudStorage.uploadFile(attachment, { fileName: attachmentPath });
    return { url, type: fileType, uid: undefined };
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
