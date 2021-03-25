import { Connection } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { AuctionAssetModel, IAuctionAssetModel } from '../mongodb/AuctionAssetModel';
import { GCloudStorage, IFile } from '../../GCloudStorage';

export class AuctionAttachmentsService {
  public readonly AuctionAsset = AuctionAssetModel(this.connection);

  constructor(private readonly connection: Connection, private readonly cloudStorage: GCloudStorage) {}

  public async uploadFileAttachment(
    id: string,
    userId: string,
    attachment: Promise<IFile>,
  ): Promise<IAuctionAssetModel> {
    const attachmentUrl = `${userId}/auctions/${id}/${uuid()}`;

    const { fileType, url, uid } = await this.cloudStorage.uploadFile(attachment, { fileName: attachmentUrl });
    const assetUid = Boolean(uid) ? { uid } : {};
    const asset = new this.AuctionAsset({ url, type: fileType, ...assetUid });
    await asset.save();
    return asset;
  }

  public async removeFileAttachment(attachmentUrl: string): Promise<void> {
    await this.cloudStorage.removeFile(attachmentUrl);
  }
}
