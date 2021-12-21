import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { InMemoryCache } from '@apollo/client';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';

import CharitiesPage from '..';
import ClickableTr from 'src/components/wrappers/ClickableTr';
import SearchInput from 'src/components/forms/inputs/SearchInput';
import { AdminPage } from 'src/components/layouts/AdminPage';
import { CharitiesListQuery } from 'src/apollo/queries/charities';

const cache = new InMemoryCache();

cache.writeQuery({
  query: CharitiesListQuery,
  variables: { size: 20, skip: 0, filters: { query: '' }, orderBy: 'STATUS_ASC' },
  data: {
    charitiesList: {
      items: [
        {
          id: 'testId1',
          name: 'test',
          semanticId: null,
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
