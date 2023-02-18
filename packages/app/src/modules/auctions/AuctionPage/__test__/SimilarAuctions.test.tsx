import React from 'react';
import SimilarAuctions from '../SimilarAuctions';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { AuctionsListQuery } from 'src/apollo/queries/auctions';
import { auction } from 'src/helpers/testHelpers/auction';
import { MemoryRouter } from 'react-router-dom';
import { InMemoryCache } from '@apollo/client';
import { ToastProvider } from 'react-toast-notifications';
import { act } from 'react-dom/test-utils';
import { AuctionStatus } from 'src/types/Auction';

jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());

const cache = new InMemoryCache();

cache.writeQuery({
  query: AuctionsListQuery,
  variables: {
    size: 10,
    skip: 0,
    filters: {
      status: [AuctionStatus.ACTIVE],
    },
  },
  data: {
    auctions: {
      items: [auction],
      size: 1,
      skip: 0,
      totalItems: 1,
    },
  },
});

describe('SimilarAuctions ', () => {
  it('component is defined but has not section', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <SimilarAuctions />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    expect(wrapper!).toHaveLength(1);
    expect(wrapper!.find('section')).toHaveLength(0);
  });
  it('component is defined and has section', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache}>
              <SimilarAuctions />
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
    expect(wrapper!.find('section')).toHaveLength(1);
  });
});
