import { act } from 'react-dom/test-utils';
import { ReactWrapper, mount } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';

import Filters from '../Filters';
import SearchInput from 'src/components/forms/inputs/SearchInput';

describe('Should render correctly "Filters"', () => {
  const props: any = {
    changeFilters: jest.fn(),
  };

  it('component is defined', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MockedProvider>
          <Filters {...props} />
        </MockedProvider>,
      );
    });
    expect(wrapper!).toHaveLength(1);
  });
  it('should call changeFilters', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MockedProvider>
          <Filters {...props} />
        </MockedProvider>,
      );
    });

    wrapper!.find(SearchInput).props().onChange('test');
    wrapper!
      .find(SearchInput)
      .children()
      .find('input')
      .simulate('change', { target: { value: 'test' } });
    wrapper!.find(SearchInput).children().find('Button').simulate('click');
    expect(props.changeFilters).toHaveBeenCalled();
  });
});
