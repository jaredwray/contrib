import { Auction } from 'src/types/Auction';

export const metricSystem = ['imperial', 'metric system'];

export const ParcelProps = (auction: Auction) => {
  const { length, width, height, weight, units } = auction.delivery.parcel!;
  const size = `${length}x${width}x${height}`;
  if (units === metricSystem[0]) {
    return `${size} (in), ${weight} (lb)`;
  }
  return `${size} (cm), ${weight} (kg)`;
};
