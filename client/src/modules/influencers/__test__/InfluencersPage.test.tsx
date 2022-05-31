import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { InfluencersListQuery } from 'src/apollo/queries/influencers';
import { AllItemsLayout } from 'src/components/layouts/AllItemsLayout';

import InfluerncersPage from '../InfluerncersPage';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();

cache.writeQuery({
  query: InfluencersListQuery,
  variables: {
    size: 20,
    skip: 0,
    orderBy: 'DEFAULT',
    filters: {
      query: '',
      status: ['ONBOARDED'],
    },
  },
  data: {
    influencersList: {
      totalItems: 1,
      size: 1,
      skip: 0,
      items: [
        {
          id: '61d4c8ce28d39b1e43b04796',
          name: '15416356158 15416356158',
          avatarUrl: '/content/img/users/person.png',
          sport: 'asd',
          status: 'ONBOARDED',
          totalRaisedAmount: {
            amount: 0,
            currency: 'USD',
            precision: 2,
          },
          followers: [],
        },
      ],
    },
  },
});

describe('InfluerncersPage', () => {
  let wrapper: ReactWrapper;

  beforeEach(async () => {
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <MemoryRouter>
            <MockedProvider cache={cache}>
              <InfluerncersPage />
            </MockedProvider>
          </MemoryRouter>
        </ToastProvider>,
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
