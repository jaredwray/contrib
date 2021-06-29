import { shallow, ShallowWrapper } from 'enzyme';
import { auction } from 'src/helpers/testHelpers/auction';
import { charity } from 'src/helpers/testHelpers/charity';
import { Details } from '../Details';
describe('Should render correctly "Details"', () => {
  const props: any = {
    auction: auction,
    charity: charity,
    timeZone: 'America/Los_Angeles',
  };

  let wrapper: ShallowWrapper;
  beforeEach(() => {
    wrapper = shallow(<Details {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
