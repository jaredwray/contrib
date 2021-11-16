import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';

import { InfluencersListQuery } from 'src/apollo/queries/influencers';
import { AllItemsLayout } from 'src/components/layouts/AllItemsLayout';

import InfluerncersPage from '../InfluerncersPage';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();

cache.writeQuery({
  query: InfluencersListQuery,
  variables: { size: 100, skip: 0, filters: { query: '', orderBy: 'DEFAULT', pageSkip: 0 } },

  data: {
    influencersList: {
      size: 100,
      skip: 0,
      totalItems: 2,
      items: [],
    },
  },
});

describe('InfluerncersPage', () => {
  let wrapper: ReactWrapper;

  beforeEach(async () => {
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <MockedProvider cache={cache}>
            <InfluerncersPage />
          </MockedProvider>
        </MemoryRouter>,
      );
    });
  });

  it('component is defined', async () => {
    expect(wrapper).toHaveLength(1);
  });

  describe('after function call "changeFilters"', () => {
    it('component state "filters" has changed ', async () => {
      await act(async () => {
        wrapper!.children().find(AllItemsLayout).props().changeFilters('testKey', 'testValue');
      });

      wrapper.update();

      expect(wrapper!.children().find(AllItemsLayout).props().filters).toBeDefined();
    });
  });
});
