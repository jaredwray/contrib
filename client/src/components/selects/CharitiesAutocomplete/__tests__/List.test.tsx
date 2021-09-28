import { shallow, ShallowWrapper } from 'enzyme';

import CharitiesList from 'src/components/selects/CharitiesAutocomplete/List';

describe('Should render correctly "CharitiesList"', () => {
  const props: any = {
    charities: [{ id: 'test', name: 'test' }],
    onChange: jest.fn(),
  };

  let wrapper: ShallowWrapper;
  beforeEach(() => {
    wrapper = shallow(<CharitiesList {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('it should call onClick when clicking', () => {
    wrapper.find('button').simulate('click');
    expect(props.onChange).toHaveBeenCalledTimes(1);
  });
});
