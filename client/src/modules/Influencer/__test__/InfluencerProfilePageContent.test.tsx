import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { InMemoryCache } from '@apollo/client';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';

import { AuctionStatus } from 'src/types/Auction';
import WatchBtn from 'src/components/WatchBtn';
import AuctionCard from 'src/components/AuctionCard';
import { auction } from 'src/helpers/testHelpers/auction';
import { AuctionsListQuery } from 'src/apollo/queries/auctions';
import { withAuthenticatedUser, withNotAuthenticatedUser, mockedUseAuth0 } from 'src/helpers/testHelpers/auth0';
import { FollowInfluencer, UnfollowInfluencer } from 'src/apollo/queries/influencers';
import { InfluencerProfilePageContent } from '../InfluencerProfilePage/InfluencerProfilePageContent';

jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());
jest.mock('@auth0/auth0-react');

const cache = new InMemoryCache();
const cache2 = new InMemoryCache();
cache.writeQuery({
  query: AuctionsListQuery,
  variables: {
    filters: {
      auctionOrganizer: 'testId',
      status: [
        AuctionStatus.DRAFT,
        AuctionStatus.ACTIVE,
        AuctionStatus.SETTLED,
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
        { ...auction, isFailed: false, isSettled: true, status: AuctionStatus.SETTLED },
        { ...auction, isFailed: false, isStopped: true, status: AuctionStatus.STOPPED },
      ],
      size: 1,
      skip: 0,
      totalItems: 1,
    },
  },
});
cache2.writeQuery({
  query: AuctionsListQuery,
  variables: {
    filters: {
      auctionOrganizer: 'testId',
      status: [
        AuctionStatus.DRAFT,
        AuctionStatus.ACTIVE,
        AuctionStatus.SETTLED,
        AuctionStatus.STOPPED,
        AuctionStatus.SOLD,
      ],
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
const mockFn = jest.fn();

const mocks = [
  {
    request: {
      query: UnfollowInfluencer,
      variables: {
        influencerId: 'testId',
      },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          unfollowInfluencer: {
            id: 'testId',
          },
        },
      };
    },
  },
  {
    request: {
      query: FollowInfluencer,
      variables: {
        influencerId: 'testId',
      },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          unfollowInfluencer: {
            user: 'testId',
            createdAt: 'test Date',
          },
        },
      };
    },
  },
];
const errorMocks = [
  {
    request: {
      query: UnfollowInfluencer,
      variables: {},
    },
    newData: () => {
      mockFn();
      return {
        data: {},
      };
    },
  },
  {
    request: {
      query: FollowInfluencer,
      variables: {},
    },
    newData: () => {
      mockFn();
      return {
        data: {},
      };
    },
  },
];
describe('InfluencerProfilePageContent ', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', async () => {
    withAuthenticatedUser();
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
  });
  it('should redirect and not call FollowInfluencer mutation', async () => {
    withNotAuthenticatedUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache2} mocks={mocks}>
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
    await act(async () => {
      expect(wrapper!.find(AuctionCard)).toHaveLength(1);
      wrapper!.find(WatchBtn).prop('followHandler')!();
    });
    expect(mockedUseAuth0().loginWithRedirect).toHaveBeenCalled();
  });
  it('should call FollowInfluencer mutation', async () => {
    withAuthenticatedUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache2} mocks={mocks}>
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
    await act(async () => {
      expect(wrapper!.find(AuctionCard)).toHaveLength(1);
      wrapper!.find(WatchBtn).prop('followHandler')!();
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  it('should call UnfollowInfluencer mutation', async () => {
    withAuthenticatedUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache2} mocks={mocks}>
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
    await act(async () => {
      expect(wrapper!.find(AuctionCard)).toHaveLength(1);
      wrapper!.find(WatchBtn).prop('unfollowHandler')!();
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  it('should not call FollowInfluencer mutation becouse of error', async () => {
    withAuthenticatedUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache2} mocks={errorMocks}>
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
    await act(async () => {
      expect(wrapper!.find(AuctionCard)).toHaveLength(1);
      wrapper!.find(WatchBtn).prop('followHandler')!();
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
  it('should not call UnfollowInfluencer mutation becouse of error', async () => {
    withAuthenticatedUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache2} mocks={errorMocks}>
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
    await act(async () => {
      expect(wrapper!.find(AuctionCard)).toHaveLength(1);
      wrapper!.find(WatchBtn).prop('unfollowHandler')!();
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});
