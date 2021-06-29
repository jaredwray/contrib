import { shallow, ShallowWrapper } from 'enzyme';
import { bids } from 'src/helpers/testHelpers/bids';
import { Bids } from '../Bids';
describe('Should render correctly "Bids"', () => {
  const props: any = {
    bids: bids,
    onBidClickHandler: jest.fn(),
    timeZone: 'America/Los_Angeles',
    loading: false,
  };

  let wrapper: ShallowWrapper;
  beforeEach(() => {
    wrapper = shallow(<Bids {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
