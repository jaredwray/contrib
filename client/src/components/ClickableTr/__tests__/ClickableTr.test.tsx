import { shallow } from 'enzyme';
import ClickableTr from 'src/components/ClickableTr';

describe('Should render correctly "ClickableTr"', () => {
  const props: any = {
    children: <>test text</>,
    linkTo: '/test',
  };
  const mockFn = { push: jest.fn() };

  let wrapper: any;
  beforeEach(() => {
    wrapper = shallow(<ClickableTr {...props} history={mockFn} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
