import { shallow } from 'enzyme';

import CharitiesAutocomplete from 'src/components/CharitiesAutocomplete';

describe('Should render correctly "CharitiesAutocomplete"', () => {
  const props: any = {
    charities: [],
    favoriteCharities: [],
    onChange: jest.fn(),
  };

  let wrapper: any;
  beforeEach(() => {
    wrapper = shallow(<CharitiesAutocomplete {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});