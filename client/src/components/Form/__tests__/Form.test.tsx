import { shallow, ShallowWrapper } from 'enzyme';
import Form from 'src/components/Form/Form';

describe('Should render correctly "Form"', () => {
  const props: any = {
    onSubmit: jest.fn(),
  };

  let wrapper: ShallowWrapper;
  beforeEach(() => {
    wrapper = shallow(<Form {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('it should call onSubmit when submitting', () => {
    wrapper.simulate('submit');
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });
});
