import { act } from 'react-dom/test-utils';
import { AllInfluencersQuery, InfluencersSearch } from 'src/apollo/queries/influencers';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';

import { MemoryRouter } from 'react-router-dom';
import { InMemoryCache } from '@apollo/client';

import { ToastProvider } from 'react-toast-notifications';
import Influencers from '..';

import SearchInput from 'src/components/SearchInput';
import { AdminPage } from 'src/components/AdminPage';

const cache = new InMemoryCache();

cache.writeQuery({
  query: AllInfluencersQuery,
  variables: { size: 20, skip: 0 },
  data: {
    influencers: {
      items: [{ id: 'testId', name: 'test', sport: '1231', status: 'ONBOARDED' }],
      size: 20,
      skip: 0,
      totalItems: 1,
    },
  },
});
cache.writeQuery({
  query: InfluencersSearch,
  variables: { query: 'test' },
  data: {
    influencersSearch: [{ id: 'testId', name: 'test', sport: 'test', status: 'ONBOARDED' }],
  },
});

describe('AdminAuctionPage ', () => {
  it('component is defined and has input with close button on it', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <Influencers />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    expect(wrapper!).toHaveLength(1);
  });
  it('component is defined and get data by query', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache}>
              <Influencers />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );

      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();

      expect(wrapper!).toHaveLength(1);

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
