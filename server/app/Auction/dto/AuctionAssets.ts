export enum AssetType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export type AuctionAssets = {
  id: string;
  type: AssetType;
  url: string | undefined;
  cloudflareUrl: string | null;
  thumbnail: string | undefined;
  uid: string | undefined;
  originalFileName: string | undefined | null;
};
