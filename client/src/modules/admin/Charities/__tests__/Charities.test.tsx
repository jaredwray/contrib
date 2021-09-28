import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { InMemoryCache } from '@apollo/client';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';

import CharitiesPage from '..';
import ClickableTr from 'src/components/ClickableTr';
import SearchInput from 'src/components/inputs/SearchInput';
import { AdminPage } from 'src/components/layouts/AdminPage';
import { AllCharitiesQuery, CharitiesSearch } from 'src/apollo/queries/charities';


const cache = new InMemoryCache();

cache.writeQuery({
  query: AllCharitiesQuery,
  variables: { size: 20, skip: 0 },
  data: {
    charities: {
      items: [{ id: 'testId1', name: 'test', profileStatus: 'COMPLETED', status: 'ACTIVE', stripeStatus: 'ACTIVE' }],
      size: 20,
      skip: 0,
      totalItems: 1,
    },
  },
});
cache.writeQuery({
  query: CharitiesSearch,
  variables: { query: 'test' },
  data: {
    charitiesSearch: [
      { id: 'testId2', name: 'test', profileStatus: 'COMPLETED', status: 'ACTIVE', stripeStatus: 'ACTIVE' },
    ],
  },
});

describe('AdminAuctionPage ', () => {
  it('component returns null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <CharitiesPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    expect(wrapper!.find(ClickableTr)).toHaveLength(0);
  });
  it('component is defined and has ClickableTr', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache}>
              <CharitiesPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );

      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();

      expect(wrapper!).toHaveLength(1);
      expect(wrapper!.find(ClickableTr)).toHaveLength(1);

      await wrapper
        .find(AdminPage)
        .children()
        .find('input')
        .simulate('change', { target: { value: 'test' } });
      expect(wrapper.find(AdminPage).children().find(SearchInput).children().find('button').text()).toEqual('Cancel');
      wrapper.find(AdminPage).children().find(SearchInput).children().find('button').simulate('click');
    });
  });
});
