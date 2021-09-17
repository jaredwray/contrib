import { Auction } from 'src/types/Auction';

export const metricSystem = ['imperial', 'metric system'];

export const ParcelProps = (auction: Auction) => {
  const { length, width, height, weight } = auction.delivery.parcel!;
  const size = `${length}x${width}x${height}`;
  return `${size} (in), ${weight} (lb)`;
};
