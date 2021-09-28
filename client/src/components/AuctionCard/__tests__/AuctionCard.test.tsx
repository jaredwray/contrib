import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MockedProvider } from '@apollo/client/testing';

import HeartBtn from 'src/components/buttons/HeartButton';
import AuctionCard from 'src/components/AuctionCard';
import { CloseButton } from 'src/components/buttons/CloseButton';
import { BrowserRouter as Router } from 'react-router-dom';
import { auction } from 'src/helpers/testHelpers/auction';
import { ToastProvider } from 'react-toast-notifications';
import { Modal } from 'src/components/modals/AdminAuctionsPageModal';
import { FollowAuctionMutation, UnfollowAuctionMutation } from 'src/apollo/queries/auctions';
import { withAuthenticatedUser, withNotAuthenticatedUser, mockedUseAuth0 } from 'src/helpers/testHelpers/auth0';

const props: any = {
  auction,
};
const emptyProps: any = {};

const newProps: any = {
  auction: {
    ...props.auction,
    currentPrice: null,
    isDraft: true,
    isFailed: false,
  },
};
jest.mock('@auth0/auth0-react');

const mockFn = jest.fn();

const mocks = [
  {
    request: {
      query: FollowAuctionMutation,
      variables: {
        auctionId: 'testId',
      },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          followAuction: {
            user: 'testId',
            createdAt: 'test Date',
          },
        },
      };
    },
  },
  {
    request: {
      query: UnfollowAuctionMutation,
      variables: {
        auctionId: 'testId',
      },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          unfollowAuction: {
            id: 'testId',
          },
        },
      };
    },
  },
];
const errorMocks = [
  {
    request: {
      query: FollowAuctionMutation,
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
      query: UnfollowAuctionMutation,
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
describe('Should render correctly "AuctionCard"', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());

  it('component return null', () => {
    withAuthenticatedUser();
    const wrapper = mount(
      <MockedProvider>
        <ToastProvider>
          <Router>
            <AuctionCard {...emptyProps} />
          </Router>
        </ToastProvider>
      </MockedProvider>,
    );
    expect(wrapper.find('figure')).toHaveLength(0);
    wrapper.unmount();
  });
  it('component is defined', () => {
    withAuthenticatedUser();
    const wrapper = mount(
      <MockedProvider>
        <ToastProvider>
          <Router>
            <AuctionCard {...props} />
          </Router>
        </ToastProvider>
      </MockedProvider>,
    );

    expect(wrapper.find('figure')).toHaveLength(1);
    wrapper.unmount();
  });
  it('component is defined and has CloseButton,which should open modal when clicking', () => {
    withAuthenticatedUser();
    const wrapper = mount(
      <MockedProvider>
        <ToastProvider>
          <Router>
            <AuctionCard {...newProps} />
          </Router>
        </ToastProvider>
      </MockedProvider>,
    );
    expect(wrapper.find(CloseButton)).toHaveLength(1);
    wrapper.children().find(CloseButton).simulate('click');
    wrapper.children().find(Modal).children().find('Button').first().simulate('click');
  });
  it('should redirect and not call FollowAuctionMutation mutation', async () => {
    withNotAuthenticatedUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <Router>
            <MockedProvider mocks={mocks}>
              <AuctionCard {...props} />
            </MockedProvider>
          </Router>
        </ToastProvider>,
      );
    });
    await act(async () => {
      wrapper!.find(HeartBtn).prop('followHandler')!();
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockedUseAuth0().loginWithRedirect).toHaveBeenCalled();
  });
  it('should call FollowAuctionMutation mutation', async () => {
    withAuthenticatedUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <Router>
            <MockedProvider mocks={mocks}>
              <AuctionCard {...props} />
            </MockedProvider>
          </Router>
        </ToastProvider>,
      );
    });
    await act(async () => {
      wrapper!.find(HeartBtn).prop('followHandler')!();
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  it('should call UnfollowAuctionMutation mutation', async () => {
    withAuthenticatedUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <Router>
            <MockedProvider mocks={mocks}>
              <AuctionCard {...props} />
            </MockedProvider>
          </Router>
        </ToastProvider>,
      );
    });
    await act(async () => {
      wrapper!.find(HeartBtn).prop('unfollowHandler')!();
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  it('should not call FollowAuctionMutation mutation becouse of error', async () => {
    withAuthenticatedUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <Router>
            <MockedProvider mocks={errorMocks}>
              <AuctionCard {...props} />
            </MockedProvider>
          </Router>
        </ToastProvider>,
      );
    });
    await act(async () => {
      wrapper!.find(HeartBtn).prop('followHandler')!();
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
  it('should not call UnfollowAuctionMutation mutation becouse of error', async () => {
    withAuthenticatedUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <Router>
            <MockedProvider mocks={errorMocks}>
              <AuctionCard {...props} />
            </MockedProvider>
          </Router>
        </ToastProvider>,
      );
    });
    await act(async () => {
      wrapper!.find(HeartBtn).prop('unfollowHandler')!();
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});
