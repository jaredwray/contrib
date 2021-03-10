export enum AssetType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export type AuctionAssets = {
  url: string;
  type: AssetType;
  cloudflareUrl: string | null;
  thumbnail: string | undefined;
  uid: string | undefined;
};
