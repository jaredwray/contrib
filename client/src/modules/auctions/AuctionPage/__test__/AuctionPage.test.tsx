import AuctionPage from '../';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { AuctionQuery } from 'src/apollo/queries/auctions';
import { AuctionQueryAuction } from 'src/helpers/testHelpers/auction';
import { MemoryRouter } from 'react-router-dom';
import { InMemoryCache } from '@apollo/client';
import Layout from 'src/components/layouts/Layout';
import { act } from 'react-dom/test-utils';
import { ToastProvider } from 'react-toast-notifications';

const mockHistoryFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    auctionId: 'testId',
  }),
  useHistory: () => ({
    push: mockHistoryFn,
    replace: mockHistoryFn,
  }),
  useRouteMatch: () => ({ url: '/auctions/testId' }),
}));

const cache = new InMemoryCache();

describe('AuctionPage', () => {
  describe('when invalid id provided', () => {
    cache.writeQuery({
      query: AuctionQuery,
      variables: { id: 'testId' },
      data: {
        auction: null,
      },
    });

    it('redirects to 404 page', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider cache={cache}>
                <AuctionPage />
              </MockedProvider>
            </ToastProvider>
          </MemoryRouter>,
        );
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });
      expect(mockHistoryFn).toBeCalled();
    });
  });

  describe('with valid data', () => {
    cache.writeQuery({
      query: AuctionQuery,
      variables: { id: 'testId' },
      data: {
        auction: { ...AuctionQueryAuction, isActive: true, isDraft: false, isStopped: false },
      },
    });

    xit('renders the component', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider cache={cache}>
                <AuctionPage />
              </MockedProvider>
            </ToastProvider>
          </MemoryRouter>,
        );
      });
      expect(wrapper!.find(Layout)).toHaveLength(1);
    });
  });

  describe('with an error or when an auction is not loaded yet', () => {
    it('returns null', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <MockedProvider>
              <AuctionPage />
            </MockedProvider>
          </MemoryRouter>,
        );
      });
      expect(wrapper!.find(Layout)).toHaveLength(0);
    });
  });

  describe('when the auction is stopped', () => {
    cache.writeQuery({
      query: AuctionQuery,
      variables: { id: 'testId' },
      data: {
        auction: AuctionQueryAuction,
      },
    });

    it('redirects to the Home page', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider cache={cache}>
                <AuctionPage />
              </MockedProvider>
            </ToastProvider>
          </MemoryRouter>,
        );
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });
      expect(mockHistoryFn).toHaveBeenCalled();
    });
  });

  describe('when the auction is draft', () => {
    cache.writeQuery({
      query: AuctionQuery,
      variables: { id: 'testId' },
      data: {
        auction: { ...AuctionQueryAuction, isDraft: true, isStopped: false },
      },
    });

    it('redirects to the Home page', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider cache={cache}>
                <AuctionPage />
              </MockedProvider>
            </ToastProvider>
          </MemoryRouter>,
        );
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });
      expect(mockHistoryFn).toHaveBeenCalled();
    });
  });
});
