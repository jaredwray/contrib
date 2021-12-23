import { mount, ReactWrapper } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { ToastProvider } from 'react-toast-notifications';
import { MockedProvider } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';

import { AuctionQuery } from 'src/apollo/queries/auctions';
import { AuctionQueryAuction } from 'src/helpers/testHelpers/auction';
import Layout from 'src/components/layouts/Layout';

import AuctionPage from '../';

const mockHistoryFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    auctionId: 'testId',
  }),
  useHistory: () => ({
    push: mockHistoryFn,
    replace: mockHistoryFn,
    goBack: mockHistoryFn,
  }),
  useRouteMatch: () => ({ url: '/auctions/testId' }),
}));

const draftAuctionCache = new InMemoryCache();
const nullAuctionCache = new InMemoryCache();
const activeAuctionCache = new InMemoryCache();
const stoppedAuctionCache = new InMemoryCache();

stoppedAuctionCache.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: {
    auction: AuctionQueryAuction,
  },
});

nullAuctionCache.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: {
    auction: null,
  },
});

activeAuctionCache.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: {
    auction: { ...AuctionQueryAuction, isActive: true, isDraft: false, isStopped: false },
  },
});

draftAuctionCache.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: {
    auction: { ...AuctionQueryAuction, isDraft: true, isStopped: false },
  },
});

describe('AuctionPage', () => {
  describe('when invalid id provided', () => {
    it('redirects to 404 page', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider cache={nullAuctionCache}>
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
    it('renders the component', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider cache={activeAuctionCache}>
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
    it('redirects to the Home page', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider cache={stoppedAuctionCache}>
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
    it('redirects to the Home page', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider cache={draftAuctionCache}>
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

  describe('when the auction is draft and account owner is admin', () => {
    xit('redirects to previos page', async () => {
      // const contextValues: any = {
      //   account: {
      //     assistant: null,
      //     charity: null,
      //     createdAt: '2021-04-13T08:09:54.943Z',
      //     id: 'test',
      //     influencerProfile: {
      //       id: 'testId',
      //       profileDescription: 'test',
      //       name: 'test',
      //       sport: 'test',
      //     },
      //     isAdmin: false,
      //     mongodbId: 'testId',
      //     notAcceptedTerms: null,
      //     paymentInformation: {
      //       id: 'testId',
      //       cardNumberLast4: '4242',
      //       cardBrand: 'Visa',
      //       cardExpirationMonth: 4,
      //     },
      //     phoneNumber: '+000000000000',
      //     status: 'COMPLETED',
      //   },
      // };

      // jest.spyOn(React, 'useContext').mockImplementation(() => contextValues);

      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider cache={draftAuctionCache}>
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
