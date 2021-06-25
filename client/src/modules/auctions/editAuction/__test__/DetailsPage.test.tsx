import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ToastProvider } from 'react-toast-notifications';
import { BrowserRouter as Router } from 'react-router-dom';
import { getAuctionDetails } from 'src/apollo/queries/auctions';

import EditAuctionDetailsPage from '../DetailsPage';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();
cache.writeQuery({
  query: getAuctionDetails,
  data: {
    auction: {
      id: '123',
      startDate: '2021-05-31T14:22:48.000+00:00',
      endDate: '2021-05-31T14:22:48.000+00:00',
      itemPrice: {},
      startPrice: {},
      link: 'test/kink',
      charity: {
        id: '321',
        name: 'name',
      },
      auctionOrganizer: {
        favoriteCharities: {
          id: '12233',
          name: 'Name',
        },
      },
    },
  },
});

test('renders without crashing', async () => {
  await act(async () => {
    shallow(
      <Router>
        <ToastProvider>
          <MockedProvider cache={cache}>
            <EditAuctionDetailsPage />
          </MockedProvider>
        </ToastProvider>
      </Router>,
    );
  });
});
