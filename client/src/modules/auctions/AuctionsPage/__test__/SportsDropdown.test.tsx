import SportsDropdown from '../Filters/SportsDropdown';
import { ReactWrapper, mount } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import Select from 'src/components/Select';

describe('Should render correctly "SportsDropdown"', () => {
  const props: any = {
    selectedSports: [],
    changeFilters: jest.fn(),
  };

  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <MockedProvider>
        <SportsDropdown {...props} />
      </MockedProvider>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('should call changeFilters when changing', () => {
    wrapper.find(Select).props().onChange('All');
    expect(props.changeFilters).toHaveBeenCalledTimes(1);
  });
});
