import { shallow, ShallowWrapper } from 'enzyme';
import PrivateRoute from 'src/components/PrivateRoute';

describe('Should render correctly "PrivateRoute"', () => {
  const props: any = {
    path: '/test',
    role: 'influencer',
    conmponent: <></>,
  };
  let wrapper: ShallowWrapper;
  beforeEach(() => {
    wrapper = shallow(<PrivateRoute {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
