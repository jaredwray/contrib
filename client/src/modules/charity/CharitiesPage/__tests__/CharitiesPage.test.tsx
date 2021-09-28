import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom';

import { CharitiesListQuery } from 'src/apollo/queries/charities';

import CharityPage from '..';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();
cache.writeQuery({
  query: CharitiesListQuery,
  data: {
    auctions: {
      size: 100,
      skip: 0,
      totalItems: 2,
      items: [],
    },
  },
});
describe('CharityPage', () => {
  it('renders without crashing', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <Router>
          <MockedProvider cache={cache}>
            <CharityPage />
          </MockedProvider>
        </Router>,
      );
      expect(wrapper).toHaveLength(1);
    });
  });
});
