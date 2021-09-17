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

  public async contentStorageAuthTokenRequest(): Promise<{ authToken: string; bucketName: string }> {
    const {
      clientId: client_id,
      clientSecret: client_secret,
      refreshToken: refresh_token,
    } = AppConfig.googleCloud.contentStorageAuth;

    const { data } = await axios.post('https://accounts.google.com/o/oauth2/token', {
      client_id,
      client_secret,
      refresh_token,
      grant_type: 'refresh_token',
    });

    return {
      authToken: data.access_token,
      bucketName: AppConfig.googleCloud.bucketName,
    };
  }

  public async uploadFileAttachment(
    auctionId: string,
    organizerId: string,
    attachment: Promise<IFile> | null,
    uploadUrl: string,
  ): Promise<IAuctionAssetModel> {
    const uuid = getUuid();
    const attachmentPath = `${organizerId}/auctions/${auctionId}/${uuid}/${uuid}`;

    try {
      const { fileType, url, uid } = uploadUrl
        ? await this.cloudStorage.cloudFlareVideoUpload({
            fileName: attachmentPath,
            url: uploadUrl,
          })
        : await this.cloudStorage.uploadFile(attachment, { fileName: attachmentPath });
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
