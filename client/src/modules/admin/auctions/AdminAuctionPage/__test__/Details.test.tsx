import { shallow, ShallowWrapper } from 'enzyme';
import { auction } from 'src/helpers/testHelpers/auction';
import { charity } from 'src/helpers/testHelpers/charity';
import { Details } from '../Details';
describe('Should render correctly "Details"', () => {
  const props: any = {
    auction: auction,
    charity: charity,
  };

  let wrapper: ShallowWrapper;
  beforeAll(() => {
    process.env = { ...process.env, REACT_APP_PLATFORM_URL: 'https://dev.contrib.org' };
  });
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
