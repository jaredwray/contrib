import { shallow, ShallowWrapper } from 'enzyme';

import { AuctionStatus } from 'src/types/Auction';
import { auction } from 'src/helpers/testHelpers/auction';
import { NoAuctionsInfo } from 'src/components/custom/AuctionsStatusInfo/NoAuctionsInfo';

import { CharityAuctionsInfo } from '../index';


const props: any = {
  name: 'testName',
};

const propsWithAuctions: any = {
  auctions: [
    { ...auction, isFailed: false, isActive: true },
    { ...auction, isFailed: false, isStopped: true, status: AuctionStatus.STOPPED },
    { ...auction, isFailed: false, isSettled: true, status: AuctionStatus.SETTLED },
  ],
  ...props,
};

const propsWithoutAuctions: any = {
  auctions: [],
  ...props,
};

describe('InfluencerAuctionsInfo', () => {
  it('renders component', () => {
    let wrapper: ShallowWrapper;

    wrapper = shallow(<CharityAuctionsInfo {...propsWithAuctions} />);

    expect(wrapper).toHaveLength(1);
  });

  describe('without auctions', () => {
    it('renders component', () => {
      let wrapper: ShallowWrapper;

      wrapper = shallow(<CharityAuctionsInfo {...propsWithoutAuctions} />);

      expect(wrapper).toHaveLength(1);
      expect(NoAuctionsInfo).toHaveLength(1);
    });
  });
});
