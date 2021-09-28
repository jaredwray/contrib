import { mount, ReactWrapper } from 'enzyme';
import Select from 'react-select';

import { CharitySearchSelect } from 'src/components/selects/CharitySearchSelect';

describe('Should render correctly "CharitySearchSelect"', () => {
  const props: any = {
    options: [{ value: 'test', label: 'test', id: 'testId' }],
    selectedOption: { value: 'test', label: 'test', id: 'testId' },
    onChange: jest.fn(),
  };

  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(<CharitySearchSelect {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('component shpuld return "no charities found"', () => {
    expect(wrapper.find(Select).prop('noOptionsMessage')()).toEqual('no charities found');
  });
});
