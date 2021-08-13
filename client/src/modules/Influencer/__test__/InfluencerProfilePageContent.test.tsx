import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { InMemoryCache } from '@apollo/client';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';
import { auction } from 'src/helpers/testHelpers/auction';
import { AuctionsListQuery } from 'src/apollo/queries/auctions';

import { AuctionStatus } from 'src/types/Auction';
import { InfluencerProfilePageContent } from '../InfluencerProfilePage/InfluencerProfilePageContent';

jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());

const cache = new InMemoryCache();

cache.writeQuery({
  query: AuctionsListQuery,
  variables: {
    filters: {
      auctionOrganizer: 'testId',
      status: [
        AuctionStatus.DRAFT,
        AuctionStatus.ACTIVE,
        AuctionStatus.SETTLED,
        AuctionStatus.PENDING,
        AuctionStatus.STOPPED,
        AuctionStatus.SOLD,
      ],
    },
  },
  data: {
    auctions: {
      items: [
        auction,
        { ...auction, isFailed: false, isDraft: true, status: AuctionStatus.DRAFT },
        { ...auction, isFailed: false, isPending: true, status: AuctionStatus.PENDING },
        { ...auction, isFailed: false, isSettled: true, status: AuctionStatus.SETTLED },
        { ...auction, isFailed: false, isStopped: true, status: AuctionStatus.STOPPED },
      ],
      size: 1,
      skip: 0,
      totalItems: 1,
    },
  },
});

const props: any = {
  influencer: {
    auctions: [],
    avatarUrl: 'test.webp',
    followers: [{ user: 'testId', createdAt: '2021-06-18T12:11:15.092Z' }],
    id: 'testId',
    name: 'test',
    profileDescription: 'test',
    sport: 'test',
    status: 'ONBOARDED',
    team: 'test',
  },
  totalRaisedAmount: { amount: 0, currency: 'USD', precision: 2 },
};
describe('InfluencerProfilePageContent ', () => {
  it('component is defined', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache}>
              <InfluencerProfilePageContent {...props} />
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
  });
});
