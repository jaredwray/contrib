import { mount, ShallowWrapper } from 'enzyme';

import DateDetails from 'src/components/custom/AuctionCard/DateDetails';

jest.useFakeTimers('modern').setSystemTime(new Date('2021-07-05T05:21:00.000Z'));

const props: any = {
  isDonePage: false,
  isSold: false,
  auction: {
    attachments: [{ type: 'IMAGE', url: 'https://storage.googleapis.com/' }],
    auctionOrganizer: {
      id: '602fd93aab319f3eea16a1a6',
      name: 'Bob',
      avatarUrl: 'https://storage.googleapis.com/content-dev.contrib.org/602fd93aab319f3eea16a1a6/avatar/avatar.webp',
    },
    currentPrice: { amount: 100, currency: 'USD', precision: 2 },
    description: 'zx',
    endsAt: '2021-07-29T08:05:21.000Z',
    fairMarketValue: null,
    followers: [],
    id: '60dceda2fdef44c133a15754',
    isActive: true,
    isDraft: false,
    isFailed: false,
    isSettled: false,
    isSold: false,
    isStopped: false,
    itemPrice: null,
    startsAt: '2021-07-03T02:43:00.095Z',
    startPrice: { amount: 100, currency: 'USD', precision: 2 },
    status: 'SETTLED',
    title: 'zx',
    totalBids: 0,
  },
};
describe('DateDetails', () => {
  it('renders correct information', () => {
    const wrapper = mount(<DateDetails {...props} />);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.text()).toEqual('0 bids•24D 2H 44M');
  });
  it('renders correct information for done page', () => {
    const wrapper = mount(<DateDetails {...props} />);
    wrapper.setProps({
      ...props,
      ...{ isDonePage: true },
    });
    expect(wrapper).toHaveLength(1);
  });
});
