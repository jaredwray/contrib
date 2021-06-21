import { shallow } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';

import AuctionCard from '..';

describe('Should render correctly "AuctionCard"', () => {
  const props: any = {
    auction: {
      id: 'test',
      title: 'test',
      description: 'test',
      fullPageDescription: 'test',
      playedIn: 'test',
      status: 'test',
      attachments: [{ thumbnail: 'test', type: 'IMAGE', url: 'test', className: 'test' }],
      bids: [],
      link: 'test',
      gameWorn: true,
      autographed: true,
      authenticityCertificate: true,
      sport: 'test',
      totalBids: 1,
      startDate: '2021-05-31T14:22:48.000+00:00',
      endDate: '2021-05-31T14:22:48.000+00:00',
      startPrice: { amount: 1, currency: 'USD' },
      currentPrice: { amount: 1, currency: 'USD' },
      auctionOrganizer: { avatarUrl: 'test', id: 'test', name: 'test' },
      fairMarketValue: { amount: 1, currency: 'USD' },
      timeZone: 'EST',
      isActive: true,
      isDraft: false,
      isPending: false,
      isSettled: false,
      isFailed: false,
      isSold: false,
    },
  };
  let wrapper: any;
  beforeEach(() => {
    wrapper = shallow(
      <MockedProvider mocks={[]}>
        <AuctionCard {...props} />
      </MockedProvider>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
