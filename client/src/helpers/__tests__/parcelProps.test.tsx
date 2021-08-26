import { ParcelProps } from '../ParcelProps';
import { Auction, AuctionStatus } from 'src/types/Auction';

describe('ParcelProps function test', () => {
  const auction: Auction = {
    id: 'testId',
    title: 'test',
    description: 'test',
    fullPageDescription: 'test',
    playedIn: 'test',
    status: AuctionStatus.ACTIVE,
    attachments: [
      {
        type: 'IMAGE',
        url: 'test',
        id: 'testId',
        uid: 'test',
        cloudflareUrl: 'test',
        thumbnail: 'test',
      },
    ],
    link: 'test',
    gameWorn: false,
    autographed: false,
    authenticityCertificate: false,
    sport: 'test',
    totalBids: 1,
    startDate: 'test',
    endDate: 'test',
    startPrice: { amount: 1100, currency: 'USD', precision: 2 },
    currentPrice: { amount: 1100, currency: 'USD', precision: 2 },
    auctionOrganizer: {
      avatarUrl: 'test',
      id: 'test',
      name: 'test',
      sport: 'test',
      team: 'test',
      profileDescription: 'test',
      favoriteCharities: [],
      assistants: [],
    },
    fairMarketValue: { amount: 1100, currency: 'USD', precision: 2 },
    timeZone: 'test',
    isActive: false,
    isDraft: false,
    isPending: false,
    isSettled: false,
    isFailed: false,
    isSold: false,
    isStopped: false,
  };
  const auctionWithImperialUnits = {
    ...auction,
    parcel: { height: 1, length: 1, units: 'imperial', weight: 1, width: 1 },
  };
  const auctionWithMetricUnits = {
    ...auction,
    parcel: { height: 1, length: 1, units: 'metric system', weight: 1, width: 1 },
  };

  it('it should return ""', () => {
    expect(ParcelProps(auction)).toBe('');
  });
  it('it should return "1x1x1 (in), 1 (lb)"', () => {
    expect(ParcelProps(auctionWithImperialUnits)).toBe('1x1x1 (in), 1 (lb)');
  });
  it('it should return "1x1x1 (cm), 1 (kg)"', () => {
    expect(ParcelProps(auctionWithMetricUnits)).toBe('1x1x1 (cm), 1 (kg)');
  });
});
