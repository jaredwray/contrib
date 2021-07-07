import AdminAuctionPage from '..';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { AuctionForAdminPage, CustomerInformation } from 'src/apollo/queries/auctions';
import { auctionForAdminPage } from 'src/helpers/testHelpers/auction';
import { MemoryRouter } from 'react-router-dom';
import { InMemoryCache } from '@apollo/client';
import Layout from 'src/components/Layout';
import { ToastProvider } from 'react-toast-notifications';
import { act } from 'react-dom/test-utils';
import AsyncButton from 'src/components/AsyncButton';
import Bids from '../Bids';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    auctionId: 'testId',
  }),
  useRouteMatch: () => ({ url: '/admin/auctions/testId' }),
}));

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

jest.mock('react-chartjs-2', () => ({
  Doughnut: () => null,
  Bar: () => null,
}));

const cache = new InMemoryCache();
const cache2 = new InMemoryCache();

cache.writeQuery({
  query: AuctionForAdminPage,
  variables: {
    id: 'testId',
  },
  data: {
    getAuctionForAdminPage: auctionForAdminPage,
  },
});
cache2.writeQuery({
  query: CustomerInformation,
  variables: {
    stripeCustomerId: 'cus_Jcry1vA3iHj9Eh',
  },
  data: {
    getCustomerInformation: { email: 'qwertman2018@gmail.com', phone: '+375291111111' },
  },
});

describe('AdminAuctionPage ', () => {
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
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(wrapper!.find(Layout)).toHaveLength(0);
  });
  it('component is defined and have Layout', async () => {
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
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(wrapper!).toHaveLength(1);
    expect(wrapper!.find(Layout)).toBeDefined();
  });
  xit('component is defined and have Bids', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache2}>
              <MockedProvider cache={cache}>
                <AdminAuctionPage />
              </MockedProvider>
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
      wrapper!.find(Bids).children().find(AsyncButton).simulate('click');
      wrapper.update();
    });
    expect(wrapper!.find(Layout)).toBeDefined();
  });
});
