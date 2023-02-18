import { shallow, ShallowWrapper } from 'enzyme';
import DialogActions from 'src/components/modals/Dialog/DialogActions';

describe('Should render correctly "DialogActions "', () => {
  let wrapper: ShallowWrapper;
  beforeEach(() => {
    wrapper = shallow(<DialogActions />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
