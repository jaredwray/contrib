import { shallow, ShallowWrapper } from 'enzyme';
import { bitly } from 'src/helpers/testHelpers/bitly';
import { ClicksAnalytics } from '../ClicksAnalytics';
describe('Should render correctly "ClicksAnalytics"', () => {
  const props: any = { bitly };

  let wrapper: ShallowWrapper;
  beforeEach(() => {
    wrapper = shallow(<ClicksAnalytics {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
