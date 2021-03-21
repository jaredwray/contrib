import Stream from 'stream';
import { Storage } from '@google-cloud/storage';
import { AppConfig } from '../config';
import { AppError, ErrorCode } from '../errors';
import { CloudflareStreaming } from './CloudflareStreaming';

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
  private static readonly imageSupportedFormats = /png|jpeg|jpg|webp/;
  private static readonly videoSupportedFormats = /mp4|webm|opgg/;

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

  async removeFile(fileUrl: string, bucketName: string = AppConfig.googleCloud.bucketName): Promise<void> {
    const fileName = GCloudStorage.getFileNameFromUrl(fileUrl);
    try {
      await this.storage.bucket(bucketName).file(fileName).delete();
    } catch (error) {
      throw new AppError(`Unable to remove file, threw error ${error.message}`, ErrorCode.INTERNAL_ERROR);
    }
  }

  async uploadFile(
    file: Promise<IFile>,
    {
      bucketName = AppConfig.googleCloud.bucketName,
      fileName,
      shouldResizeImage = false,
    }: { bucketName?: string; fileName: string; shouldResizeImage?: boolean },
  ): Promise<{ fileType: FileType; url: string; uid: string | undefined }> {
    const { createReadStream, filename } = await file;

    const extension = filename.split('.').pop();
    const fileType = GCloudStorage.getFileType(extension);

    if (fileType === FileType.UNKNOWN) {
      throw new AppError('Unsupported file format', ErrorCode.BAD_REQUEST);
    }
    const formattedFileName = `${fileName}.${extension}`;
    const buffer = await this.streamToBuffer(createReadStream());
    let assetUrl = formattedFileName;

    if (fileType === FileType.IMAGE && shouldResizeImage) {
      assetUrl = `pending/${formattedFileName}`;
    }

    try {
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
      throw new AppError(`Cannot process the file, threw error ${error.message}`, ErrorCode.INTERNAL_ERROR);
    }
  }
}
