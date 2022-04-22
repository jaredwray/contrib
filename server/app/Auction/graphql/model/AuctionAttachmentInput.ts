import { IFile } from '../../../GCloudStorage';

export type AuctionAttachmentInput = {
  file: Promise<IFile>;
  uid?: string | null;
  filename?: string;
  forCover?: boolean;
};
