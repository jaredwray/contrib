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

describe('CharitiesPage', () => {
  describe('when there are items by passed query', () => {
    beforeEach(() => {
      cache.writeQuery({
        query: CharitiesListQuery,
        variables: {
          size: 20,
          skip: 0,
          orderBy: 'ACTIVATED_AT_ASC',
          filters: { query: '', status: ['ACTIVE'] },
        },
        data: {
          charitiesList: {
            items: [
              {
                id: 'testId1',
                name: 'test',
                semanticId: 'test',
                profileStatus: 'COMPLETED',
                status: 'ACTIVE',
                stripeStatus: 'ACTIVE',
                avatarUrl: 'test url',
                totalRaisedAmount: 0,
                followers: [],
              },
              {
                id: 'testId2',
                name: 'test2',
                semanticId: null,
                profileStatus: 'COMPLETED',
                status: 'ACTIVE',
                stripeStatus: 'ACTIVE',
                avatarUrl: 'test url',
                totalRaisedAmount: 0,
                followers: [],
              },
            ],
            size: 20,
            skip: 0,
            totalItems: 1,
          },
        },
      });
    });
    it('renders charities', async () => {
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
      expect(wrapper).toHaveLength(1);
      expect(wrapper!.find(ItemCard)).toHaveLength(2);
    });
  });

  describe('when there are no items by passed query', () => {
    beforeEach(() => {
      cache.writeQuery({
        query: CharitiesListQuery,
        variables: {
          size: 20,
          skip: 0,
          orderBy: 'ACTIVATED_AT_ASC',
          filters: { query: 'test', status: ['ACTIVE'] },
        },
        data: {
          charitiesList: {
            totalItems: 1,
            size: 20,
            skip: 0,
            items: [],
          },
        },
      });
    });

    it('does not render charities', async () => {
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
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });
      expect(wrapper!.find(ItemCard)).toHaveLength(0);
    });
  });
});
