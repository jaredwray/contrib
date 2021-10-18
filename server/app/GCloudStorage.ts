import Stream from 'stream';
import { Storage } from '@google-cloud/storage';
import { AppConfig } from '../config';
import { AppError, ErrorCode } from '../errors';
import { AppLogger } from '../logger';
import { CloudflareStreaming } from './CloudflareStreaming';
import { IAuctionAssetModel } from '../app/Auction/mongodb/AuctionAssetModel';

export type IFile = {
  createReadStream: () => Stream;
  filename: string;
  mimetype: string;
};
enum FileType {
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  UNKNOWN = 'UNKNOWN',
}

export class GCloudStorage {
  private readonly storage = new Storage({ credentials: JSON.parse(AppConfig.googleCloud.keyDump) });
  private static readonly cloudPath = 'https://storage.googleapis.com';
  private static readonly imageSupportedFormats = /png|jpeg|jpg|webp/i;
  private static readonly videoSupportedFormats = /mp4|webm|opgg|mov/i;

  constructor(private readonly cloudflareStreaming: CloudflareStreaming) {}

  private static getBucketFullPath(bucketName: string = AppConfig.googleCloud.bucketName): string {
    return `${GCloudStorage.cloudPath}/${bucketName}`;
  }

  private static getFileNameFromUrl(url: string) {
    const fullPathToBucket = GCloudStorage.getBucketFullPath();
    if (url.includes(fullPathToBucket)) {
      const [fileName] = url.split(`${fullPathToBucket}/`).filter((item: string) => Boolean(item));
      return fileName;
    }
    return url;
  }

  private static getFileType(extension: string) {
    if (this.imageSupportedFormats.test(extension)) {
      return FileType.IMAGE;
    }
    if (this.videoSupportedFormats.test(extension)) {
      return FileType.VIDEO;
    }
    return FileType.UNKNOWN;
  }

  async streamToBuffer(stream: Stream): Promise<Buffer> {
    try {
      return new Promise((resolve, reject) => {
        const data = [];

        stream.on('data', (chunk) => {
          data.push(chunk);
        });

        stream.on('end', () => {
          resolve(Buffer.concat(data));
        });

        stream.on('error', (err) => {
          reject(err);
        });
      });
    } catch (error) {
      AppLogger.warn(`Unable to create buffer for uploading file: ${error.message}`);
      throw error;
    }
  }

  async removeFile(fileUrl: string, bucketName: string = AppConfig.googleCloud.bucketName): Promise<void> {
    const fileNameArray = GCloudStorage.getFileNameFromUrl(fileUrl).replace(/\%2F/g, '/').split('/');

    fileNameArray.pop();
    const folder = fileNameArray.join('/');

    try {
      await this.storage.bucket(bucketName).deleteFiles({ prefix: `${folder}/` }, (err) => {
        if (!err) {
          AppLogger.warn(`All files in the ${folder} directory have been deleted`);
        }
      });
    } catch (error) {
      AppLogger.warn(`Unable to remove files in ${folder}: ${error.message}`);
      throw new AppError(`Unable to remove files. Please, try later`, ErrorCode.INTERNAL_ERROR);
    }
  }

  async uploadBase64(
    base64,
    { bucketName = AppConfig.googleCloud.bucketName, organizerId, auctionId, identificationNumber },
  ) {
    const buffer = Buffer.from(base64, 'base64');
    const attachmentPath = `${organizerId}/auctions/${auctionId}/shipping_label/${identificationNumber}`;
    const formattedFileName = `${attachmentPath}.png`;
    await this.storage
      .bucket(bucketName)
      .file(formattedFileName)
      .save(buffer, {
        metadata: { contentType: 'png' },
        public: true,
        validation: 'md5',
      });
    return `${GCloudStorage.getBucketFullPath(bucketName)}/${formattedFileName}`;
  }

  async uploadFile(
    filePromise: Promise<IFile> | null,
    {
      fileName,
      bucketName = AppConfig.googleCloud.bucketName,
    }: { fileName: string; bucketName?: string; url?: string },
  ): Promise<{ fileType: FileType; url: string; uid: string | undefined }> {
    const file = await filePromise;
    const extension = file.filename.split('.').pop();
    const fileType = GCloudStorage.getFileType(extension);

    if (fileType === FileType.UNKNOWN) {
      throw new AppError('Unsupported file format', ErrorCode.BAD_REQUEST);
    }
    const formattedFileName = `${fileName}.${extension}`;
    try {
      const buffer = await this.streamToBuffer(file.createReadStream());
      await this.storage.bucket(bucketName).file(formattedFileName).save(buffer);

      if (fileType === FileType.IMAGE) {
        await this.storage.bucket(bucketName).file(`pending/${formattedFileName}`).save(buffer);
      }
      let uid;
      const url = `${GCloudStorage.getBucketFullPath(bucketName)}/${formattedFileName}`;

      if (fileType === FileType.VIDEO) {
        uid = await this.cloudflareStreaming.uploadToCloudflare(url, { name: fileName });
      }

      return { fileType, url, uid };
    } catch (error) {
      AppLogger.warn(`Cannot upload selected file: ${error.message}`);
      throw new AppError(`We cannot upload one of your selected file. Please, try later`, ErrorCode.INTERNAL_ERROR);
    }
  }
  async cloudFlareVideoUpload({
    fileName,
    url,
  }: {
    fileName: string;
    url: string;
  }): Promise<{ fileType: FileType; url: string; uid: string | undefined }> {
    try {
      const replacedUrl = url.replace(
        `firebasestorage.googleapis.com/v0/b/${AppConfig.googleCloud.bucketName}/o/`,
        `storage.googleapis.com/${AppConfig.googleCloud.bucketName}/`,
      );

      const uid = await this.cloudflareStreaming.uploadToCloudflare(replacedUrl, { name: fileName });
      return { fileType: FileType.VIDEO, url: replacedUrl, uid };
    } catch (error) {
      AppLogger.warn(`Cannot upload selected file: ${error.message}`);
      if (error.name === 'PayloadTooLargeError') {
        throw new AppError(
          `File is too big, max size is ${AppConfig.cloudflare.maxSizeGB} GB`,
          ErrorCode.INTERNAL_ERROR,
        );
      }
      throw new AppError(`We cannot upload one of your selected file. Please, try later`, ErrorCode.INTERNAL_ERROR);
    }
  }
}
