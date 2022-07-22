import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { AuctionsListQuery } from 'src/apollo/queries/auctions';
import { auction } from 'src/helpers/testHelpers/auction';
import { MemoryRouter } from 'react-router-dom';
import { InMemoryCache } from '@apollo/client';
import EndingSoon from '../EndingSoon';
import { ToastProvider } from 'react-toast-notifications';
import { act } from 'react-dom/test-utils';
import { AuctionStatus } from 'src/types/Auction';
import Slider from 'src/components/custom/Slider';

jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());
const cacheWithItems = new InMemoryCache();
const cacheWithoutItems = new InMemoryCache();

cacheWithItems.writeQuery({
  query: AuctionsListQuery,
  variables: {
    size: 25,
    orderBy: 'ENDING_SOON',
    filters: {
      status: [AuctionStatus.ACTIVE, AuctionStatus.SETTLED, AuctionStatus.SOLD],
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

cacheWithoutItems.writeQuery({
  query: AuctionsListQuery,
  variables: {
    size: 25,
    orderBy: 'ENDING_SOON',
    filters: {
      status: [AuctionStatus.ACTIVE, AuctionStatus.SETTLED, AuctionStatus.SOLD],
    },
  },
  data: {
    auctions: {
      items: [],
      totalItems: 1,
    },
  },
});

describe('EndingSoon', () => {
  describe('with data', () => {
    it('component is defined and have section', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider cache={cacheWithItems}>
                <EndingSoon />
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
      expect(wrapper!.find(Slider)).toHaveLength(1);
    });
  });

  describe('without data', () => {
    it('component should not have slider', async () => {
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider cache={cacheWithoutItems}>
                <EndingSoon />
              </MockedProvider>
            </ToastProvider>
          </MemoryRouter>,
        );
      });
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });
      expect(wrapper!.find(Slider)).toHaveLength(0);
    });
  });
});
