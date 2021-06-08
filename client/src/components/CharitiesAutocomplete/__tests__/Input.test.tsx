import { shallow } from 'enzyme';

import CharitiesSearchInput from 'src/components/CharitiesAutocomplete/Input';

describe('Should render correctly "CharitiesSearchInput"', () => {
  const props: any = {
    charities: [{ id: 'test', name: 'test' }],
    favoriteCharities: [],
    onChange: jest.fn(),
  };

  let wrapper: any;
  beforeEach(() => {
    wrapper = shallow(<CharitiesSearchInput {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
