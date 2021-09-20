import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { InMemoryCache } from '@apollo/client';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';
import { Table, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Influencers from '..';
import ClickableTr from 'src/components/ClickableTr';
import { InviteButton } from 'src/components/InviteButton';
import { ActionsDropdown } from 'src/components/ActionsDropdown';
import { AdminPage } from 'src/components/AdminPage';
import SearchInput from 'src/components/SearchInput';
import { AllInfluencersQuery, InfluencersSearch, ResendInviteMessageMutation } from 'src/apollo/queries/influencers';

const cache = new InMemoryCache();

cache.writeQuery({
  query: AllInfluencersQuery,
  variables: { size: 20, skip: 0 },
  data: {
    influencers: {
      items: [{ id: 'testId', name: 'test', sport: 'test', status: 'INVITATION_PENDING' }],
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
    influencersSearch: [{ id: 'testId', name: 'test', sport: 'test', status: 'INVITATION_PENDING' }],
  },
});

const mockFn = jest.fn();

const mocks = [
  {
    request: {
      query: ResendInviteMessageMutation,
      variables: { influencerId: 'testId', name: 'test' },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          resendInviteMessage: {
            link: 'test',
            phoneNumber: 'test',
            firstName: 'test',
          },
        },
      };
    },
  },
];

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
    });
  });
});
