import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ToastProvider } from 'react-toast-notifications';
import { BrowserRouter as Router } from 'react-router-dom';
import { getAuctionDetails } from 'src/apollo/queries/auctions';
import { auction } from 'src/helpers/testHelpers/auction';
import { MemoryRouter } from 'react-router-dom';
import Layout from 'src/components/Layout';

import EditAuctionDetailsPage from '../DetailsPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    auctionId: 'testId',
  }),
  useRouteMatch: () => ({ url: '/admin/auctions/testId' }),
}));
jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();
cache.writeQuery({
  query: getAuctionDetails,
  variables: { id: 'testId' },
  data: {
    auction: {
      auctionOrganizer: { favoriteCharities: [] },
      charity: null,
      endDate: '2021-07-01T22:28:00.270Z',
      id: '60ded7d848bb5e00036b0ea6',
      isActive: true,
      itemPrice: null,
      link: 'https://go.contrib.org/3hcZeyI',
      startDate: '2021-07-01T22:28:00.261Z',
      startPrice: { amount: 0, currency: 'USD', precision: 2 },
      timeZone: null,
      title: '1',
    },
  },
});
describe('EditAuctionDetailsPage ', () => {
  it('component return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <EditAuctionDetailsPage />
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
              <EditAuctionDetailsPage />
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
    expect(wrapper!.find(Layout)).toHaveLength(1);
  });
});
