import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { InMemoryCache } from '@apollo/client';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { testAccount } from 'src/helpers/testHelpers/account';
import Layout from 'src/components/Layout';
import Form from 'src/components/Form/Form';
import EditAuctionBasicPage from '../BasicPage/Edit';
import { ToastProvider } from 'react-toast-notifications';
import { GetAuctionBasicsQuery, UpdateAuctionBasicsMutation } from 'src/apollo/queries/auctions';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';

const mockHistoryFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    auctionId: 'testId',
  }),
  useHistory: () => ({
    replace: mockHistoryFn,
    push: mockHistoryFn,
    goBack: mockHistoryFn,
  }),
  useRouteMatch: () => ({ url: '/admin/auctions/testId' }),
}));

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);
const auction = {
  auctionOrganizer: { id: 'testId' },
  authenticityCertificate: false,
  autographed: false,
  description: 'test',
  fullPageDescription: 'test',
  gameWorn: false,
  id: 'testId',
  isActive: false,
  link: 'test',
  playedIn: null,
  sport: 'asd',
  status: 'DRAFT',
  title: 'asd',
};
const cache = new InMemoryCache();
const cache2 = new InMemoryCache();
const nullDataCache = new InMemoryCache();

cache.writeQuery({
  query: GetAuctionBasicsQuery,
  variables: {
    id: 'testId',
  },
  data: {
    auction,
  },
});
cache2.writeQuery({
  query: GetAuctionBasicsQuery,
  variables: {
    id: 'testId',
  },
  data: {
    auction: { ...auction, isActive: true },
  },
});
nullDataCache.writeQuery({
  query: GetAuctionBasicsQuery,
  variables: {
    id: 'testId',
  },
  data: {
    auction: null,
  },
});

const mockFn = jest.fn();
const submitValues = {
  auctionOrganizer: { id: 'testId' },
  authenticityCertificate: false,
  autographed: false,
  description: 'test',
  fullPageDescription: 'test',
  gameWorn: false,
  id: 'testId',
  isActive: false,
  link: 'test',
  playedIn: 'test',
  sport: 'test',
  status: 'DRAFT',
};
const mocks = [
  {
    request: {
      query: UpdateAuctionBasicsMutation,
      variables: {
        ...submitValues,
      },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          updateAuction: {
            id: 'testId',
            description: 'test',
            sport: 'test',
            fullPageDescription: 'test',
            gameWorn: false,
            autographed: false,
            playedIn: 'test',
            title: 'test',
            authenticityCertificate: false,
            link: 'test',
          },
        },
      };
    },
  },
];

describe('EditAuctionBasicPage ', () => {
  it('component return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <EditAuctionBasicPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );

      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(wrapper!.find(Layout)).toHaveLength(0);
  });
  it('component should redirect to 404 page', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={nullDataCache}>
              <EditAuctionBasicPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );

      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();

      expect(mockHistoryFn).toBeCalled();
    });
  });
  it('should redirect if user is not Admin and auction isActive', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache2}>
              <EditAuctionBasicPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );

      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();

      expect(mockHistoryFn).toHaveBeenCalledTimes(1);
    });
  });
  it('component is defined and has Layout', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache}>
              <EditAuctionBasicPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );

      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();

      expect(wrapper!).toHaveLength(1);
      expect(wrapper!.find(Layout)).toHaveLength(1);
    });
  });
  it('component should submit form and call the mutation', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache} mocks={mocks}>
              <EditAuctionBasicPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    await act(async () => {
      wrapper.find(Form).props().onSubmit(submitValues);
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  it('component should submit form and call the mutation and redirect if auction isActive', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache2} mocks={mocks}>
                <EditAuctionBasicPage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    await act(async () => {
      wrapper.find(Form).props().onSubmit(submitValues);
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockHistoryFn).toHaveBeenCalledTimes(1);
  });
});
