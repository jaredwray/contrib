import { mount, ShallowWrapper } from 'enzyme';

import DateDetails from 'src/components/customComponents/AuctionCard/DateDetails';

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
    endDate: '2021-07-29T08:05:21.000Z',
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
    startDate: '2021-07-03T02:43:00.095Z',
    startPrice: { amount: 100, currency: 'USD', precision: 2 },
    status: 'SETTLED',
    title: 'zx',
    totalBids: 0,
  },
};
describe('Should render correctly "DateDetails"', () => {
  it('component is defined and has text: "0 bids • 24d 2h 44m"', () => {
    const wrapper = mount(<DateDetails {...props} />);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.text()).toEqual('0 bids•24d 2h 44m');
  });
  it('component is defined', () => {
    const wrapper = mount(<DateDetails {...props} />);
    wrapper.setProps({
      ...props,
      ...{ isSold: true },
    });
    expect(wrapper).toHaveLength(1);
    expect(wrapper.text()).toEqual('sold');
  });
  it('component is defined and has text: "ended"', () => {
    const wrapper = mount(<DateDetails {...props} />);
    wrapper.setProps({
      ...props,
      ...{
        auction: {
          ...props.auction,
          ...{ endDate: '2021-06-01T00:00:00.095Z' },
        },
      },
    });
    expect(wrapper).toHaveLength(1);
    expect(wrapper.text()).toEqual('ended');
  });
  it('component is defined and has text: "stopped"', () => {
    const wrapper = mount(<DateDetails {...props} />);
    wrapper.setProps({
      ...props,
      ...{ auction: { ...props.auction, ...{ isAsctive: false }, ...{ isStopped: true } } },
    });
    expect(wrapper).toHaveLength(1);
    expect(wrapper.text()).toEqual('stopped');
  });
  it('component is defined when its done page', () => {
    const wrapper = mount(<DateDetails {...props} />);
    wrapper.setProps({
      ...props,
      ...{ isDonePage: true },
    });
    expect(wrapper).toHaveLength(1);
  });
});
