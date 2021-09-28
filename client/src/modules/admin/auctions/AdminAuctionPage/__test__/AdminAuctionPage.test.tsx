import AdminAuctionPage from '..';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { AuctionForAdminPageQuery, CustomerInformationQuery, AuctionMetricsQuery } from 'src/apollo/queries/auctions';
import { AuctionBidsQuery } from 'src/apollo/queries/bids';
import { auctionForAdminPage } from 'src/helpers/testHelpers/auction';
import { bitly } from 'src/helpers/testHelpers/bitly';
import { bids } from 'src/helpers/testHelpers/bids';
import { MemoryRouter } from 'react-router-dom';
import { InMemoryCache } from '@apollo/client';
import Layout from 'src/components/layouts/Layout';
import { ToastProvider } from 'react-toast-notifications';
import { act } from 'react-dom/test-utils';
import { Modal } from 'src/modules/admin/auctions/AdminAuctionPage/Modal';
import Bids from '../Bids';
import DineroFactory from 'dinero.js';
import { UserAccountStatus } from 'src/types/UserAccount';
import AsyncButton from 'src/components/buttons/AsyncButton';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    auctionId: 'testId',
  }),
  useRouteMatch: () => ({ url: '/admin/auctions/testId' }),
}));

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

jest.mock('react-chartjs-2', () => ({
  Doughnut: () => null,
  Bar: () => null,
}));

const cache = new InMemoryCache();

cache.writeQuery({
  query: AuctionForAdminPageQuery,
  variables: {
    id: 'testId',
  },
  data: {
    auction: auctionForAdminPage,
  },
});
cache.writeQuery({
  query: AuctionMetricsQuery,
  variables: {
    auctionId: 'testId',
  },
  data: {
    getAuctionMetrics: bitly,
  },
});
cache.writeQuery({
  query: AuctionBidsQuery,
  variables: {
    auctionId: 'testId',
  },
  data: {
    bids,
  },
});
cache.writeQuery({
  query: CustomerInformationQuery,
  variables: { stripeCustomerId: 'testId' },
  data: {
    getCustomerInformation: { email: 'test@gmail.com', phone: '+375290000000' },
  },
});
const arg = {
  id: 'testId',
  bid: { amount: 2000, currency: DineroFactory.defaultCurrency, precision: 2 },
  createdAt: new Date('2021-07-20T21:47:12.849Z'),
  paymentSource: 'test',
  charityId: '',
  user: {
    createdAt: new Date('2021-07-20T21:47:12.849Z'),
    id: 'test',
    mongodbId: 'test',
    phoneNumber: '+000000000000',
    stripeCustomerId: 'test',
    notAcceptedTerms: null,
    status: UserAccountStatus.COMPLETED,
    paymentInformation: null,
  },
};
describe('AdminAuctionPage ', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <AdminAuctionPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );

      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(wrapper!.find(Layout)).toHaveLength(0);
  });
  it('component is defined and has Layout', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache}>
              <AdminAuctionPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );

      await new Promise((resolve) => setTimeout(resolve));
      wrapper!.update();

      expect(wrapper!).toHaveLength(1);
      expect(wrapper!.find(Layout)).toHaveLength(1);
    });

    act(() => {
      wrapper!.find(Modal).props().onClose();
    });
    act(() => {
      wrapper!.find(Modal).props().onConfirm();
    });
    await act(async () => {
      await wrapper!.find(Bids).props().onBidClickHandler(arg);
    });
    await act(async () => {
      await wrapper!.find(AsyncButton).at(0).simulate('click');
    });
  });
});
