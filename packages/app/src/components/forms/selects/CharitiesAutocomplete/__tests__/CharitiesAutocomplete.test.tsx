import { shallow, ShallowWrapper } from 'enzyme';

import SearchInput from 'src/components/forms/inputs/SearchInput';
import CharitiesAutocomplete from 'src/components/forms/selects/CharitiesAutocomplete';

describe('Should render correctly "CharitiesAutocomplete"', () => {
  const props: any = {
    charities: [],
    favoriteCharities: [],
    onChange: jest.fn(),
  };

  let wrapper: ShallowWrapper;
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
