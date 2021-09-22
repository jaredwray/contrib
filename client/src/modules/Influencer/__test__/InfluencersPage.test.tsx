import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom';

import { InfluencersListQuery } from 'src/apollo/queries/influencers';

import InfluerncersPage from '../InfluerncersPage';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();
cache.writeQuery({
  query: InfluencersListQuery,
  data: {
    auctions: {
      size: 100,
      skip: 0,
      totalItems: 2,
      items: [],
    },
  },
});
describe('InfluerncersPage', () => {
  it('renders without crashing', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <Router>
          <MockedProvider cache={cache}>
            <InfluerncersPage />
          </MockedProvider>
        </Router>,
      );
      expect(wrapper).toHaveLength(1);
    });
  });
});
