import { act } from 'react-dom/test-utils';
import { ReactWrapper, mount } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';

import Filters from '../Filters';
import { InMemoryCache } from '@apollo/client';
import SearchInput from 'src/components/forms/inputs/SearchInput';
import { ActiveCharitiesList } from 'src/apollo/queries/charities';
import { CharitySearchSelect } from 'src/components/forms/selects/CharitySearchSelect';

describe('Should render correctly "Filters"', () => {
  const props: any = {
    initialBids: {
      maxPrice: 5,
      minPrice: 1,
    },
    filters: {
      bids: {
        maxPrice: 10,
        minPrice: 1,
      },
      status: ['ACTIVE'],
      charity: [],
    },
    changeFilters: jest.fn(),
    charityChangeFilter: jest.fn(),
  };
  const cache = new InMemoryCache();
  const nullDataCache = new InMemoryCache();

  cache.writeQuery({
    query: ActiveCharitiesList,
    variables: { filters: { status: ['ACTIVE'] } },
    data: {
      charitiesList: {
        items: [
          {
            id: 'testId1',
            name: 'test',
            profileStatus: 'COMPLETED',
            status: 'ACTIVE',
            stripeStatus: 'ACTIVE',
            avatarUrl: 'test url',
            totalRaisedAmount: 0,
            followers: {
              user: '222',
            },
          },
        ],
        size: 20,
        skip: 0,
        totalItems: 1,
      },
    },
  });

  it('component is defined', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MockedProvider cache={cache}>
          <Filters {...props} />
        </MockedProvider>,
      );
    });
    expect(wrapper!).toHaveLength(1);
  });
  it('component returns null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      nullDataCache;
      wrapper = mount(
        <MockedProvider>
          <Filters {...props} />
        </MockedProvider>,
      );
    });
    expect(wrapper!.find('div')).toHaveLength(0);
  });
  it('should call changeFilters and charityChangeFilter', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MockedProvider cache={cache}>
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

    act(() => {
      wrapper!.find(CharitySearchSelect).props().onChange({ value: 'test', label: 'test', id: 'testId' });
      expect(props.charityChangeFilter).toHaveBeenCalled();
    });
  });
});
