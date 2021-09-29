import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom';

import { CharitiesListQuery } from 'src/apollo/queries/charities';
import SearchInput from 'src/components/forms/inputs/SearchInput';
import ItemCard from 'src/components/layouts/AllItemsLayout/ItemCard';
import { ToastProvider } from 'react-toast-notifications';

import CharityPage from '..';
import Filters from '../Filters';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();
const charity = {
  id: 'testId',
  name: 'test',
  avatarUrl: 'test',
  followers: [],
  totalRaisedAmount: { amount: 0, currency: 'USD', precision: 2 },
};
cache.writeQuery({
  query: CharitiesListQuery,
  variables: { size: 20, skip: 0, orderBy: 'ACTIVATED_AT_ASC', filters: { query: '' } },
  data: {
    charitiesList: {
      totalItems: 1,
      size: 20,
      skip: 0,
      items: [charity],
    },
  },
});
cache.writeQuery({
  query: CharitiesListQuery,
  variables: { size: 20, skip: 0, orderBy: 'ACTIVATED_AT_ASC', filters: { query: 'test' } },
  data: {
    charitiesList: {
      totalItems: 1,
      size: 20,
      skip: 0,
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
          <ToastProvider>
            <MockedProvider cache={cache}>
              <CharityPage />
            </MockedProvider>
          </ToastProvider>
        </Router>,
      );
      expect(wrapper).toHaveLength(1);
    });
  });
  it('renders without crashing', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <Router>
          <ToastProvider>
            <MockedProvider cache={cache}>
              <CharityPage />
            </MockedProvider>
          </ToastProvider>
        </Router>,
      );
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    await act(async () => {
      wrapper!.find(Filters).prop('changeFilters')('query', 'test');
    });
    expect(wrapper!.find(ItemCard)).toHaveLength(0);
  });
});
