import { shallow, ShallowWrapper } from 'enzyme';

import { AuctionStatus } from 'src/types/Auction';
import { auction } from 'src/helpers/testHelpers/auction';
import { influencer } from 'src/helpers/testHelpers/influencer';
import { NoAuctionsInfo } from 'src/components/customComponents/AuctionsStatusInfo/NoAuctionsInfo';

import AuctionsInfo from '..';

const mockDeletefn = jest.fn();

const props: any = {
  draftAuctions: [{ ...auction, isFailed: false, isDraft: true }],
  influencer: influencer,
  isShowDraftAndStopped: true,
  onDeleteDraftAuctions: (auction: any) => {
    mockDeletefn();
  },
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

describe('AuctionsInfo', () => {
  it('renders component', () => {
    let wrapper: ShallowWrapper;

    wrapper = shallow(<AuctionsInfo {...propsWithAuctions} />);

    expect(wrapper).toHaveLength(1);
  });

  describe('without auctions', () => {
    it('renders component', () => {
      let wrapper: ShallowWrapper;

      wrapper = shallow(<AuctionsInfo {...propsWithoutAuctions} />);

      expect(wrapper).toHaveLength(1);
      expect(NoAuctionsInfo).toHaveLength(1);
    });
  });
});
