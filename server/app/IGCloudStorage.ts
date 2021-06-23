import Stream from 'stream';
import { IFile } from './GCloudStorage';

export enum FileType {
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  UNKNOWN = 'UNKNOWN',
}

export interface IGCloudStorage {
  removeFile(fileUrl: string, bucketName?: string): Promise<void>;

  streamToBuffer(stream: Stream): Promise<Buffer>;

  uploadFile(
    filePromise: Promise<IFile>,
    params: { bucketName?: string; fileName: string; shouldResizeImage?: boolean },
  ): Promise<{ fileType: FileType; url: string; uid: string | undefined }>;
}
