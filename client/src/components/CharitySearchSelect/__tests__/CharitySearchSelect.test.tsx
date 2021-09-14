import { mount, ReactWrapper } from 'enzyme';

import { CharitySearchSelect } from 'src/components/CharitySearchSelect';

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
});
