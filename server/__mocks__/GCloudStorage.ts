import Stream from 'stream';
import { ICloudflareStreaming } from '../app/CloudflareStreaming/ICloudflareStreaming';
import { FileType, IFile, IGCloudStorage } from '../app/GCloudStorage/IGCloudStorage';

export default class GCloudStorage implements IGCloudStorage {
  constructor(private cloudflareStreaming: ICloudflareStreaming) {}
  removeFile(fileUrl: string, bucketName: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  streamToBuffer(stream: Stream): Promise<Buffer> {
    return Promise.resolve(undefined);
  }

  uploadFile(
    filePromise: Promise<IFile>,
    params: { bucketName?: string; fileName: string; shouldResizeImage?: boolean },
  ): Promise<{ fileType: FileType; url: string; uid: string | undefined }> {
    return Promise.resolve({ fileType: undefined, uid: undefined, url: '' });
  }
}
