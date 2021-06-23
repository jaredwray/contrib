import Stream from 'stream';
import { Storage } from '@google-cloud/storage';
import { AppConfig } from '../config';
import { AppError, ErrorCode } from '../errors';
import { CloudflareStreaming } from './CloudflareStreaming';
import { FileType, IGCloudStorage } from './IGCloudStorage';

export type IFile = {
  createReadStream: () => Stream;
  filename: string;
  mimetype: string;
};

export class GCloudStorage implements IGCloudStorage {
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
  }

  async removeFile(fileUrl: string, bucketName?: string): Promise<void> {
    const fileName = GCloudStorage.getFileNameFromUrl(fileUrl);
    try {
      await this.storage
        .bucket(bucketName ?? AppConfig.googleCloud.bucketName)
        .file(fileName)
        .delete();
    } catch (error) {
      throw new AppError(`Unable to remove file, threw error ${error.message}`, ErrorCode.INTERNAL_ERROR);
    }
  }

  async uploadFile(
    filePromise: Promise<IFile>,
    {
      bucketName = AppConfig.googleCloud.bucketName,
      fileName,
      shouldResizeImage = false,
    }: { bucketName?: string; fileName: string; shouldResizeImage?: boolean },
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
      let assetUrl = formattedFileName;

      if (fileType === FileType.IMAGE && shouldResizeImage) {
        assetUrl = `pending/${formattedFileName}`;
      }

      await this.storage.bucket(bucketName).file(assetUrl).save(buffer);
      let uid = undefined;

      if (fileType === FileType.VIDEO) {
        uid = await this.cloudflareStreaming.uploadToCloudflare(
          `${GCloudStorage.getBucketFullPath(bucketName)}/${formattedFileName}`,
          { name: fileName },
        );
      }
      return { fileType, url: `${GCloudStorage.getBucketFullPath(bucketName)}/${formattedFileName}`, uid: uid };
    } catch (error) {
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
