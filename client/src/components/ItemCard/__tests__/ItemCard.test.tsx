import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MockedProvider } from '@apollo/client/testing';

import HeartBtn from 'src/components/HeartButton';
import ItemCard from 'src/components/ItemCard';
import { CloseButton } from 'src/components/CloseButton';
import { BrowserRouter as Router } from 'react-router-dom';
import { auction } from 'src/helpers/testHelpers/auction';
import { ToastProvider } from 'react-toast-notifications';
import { Modal } from 'src/components/AdminAuctionsPageModal';
import { FollowAuctionMutation, UnfollowAuctionMutation } from 'src/apollo/queries/auctions';
import { withAuthenticatedUser } from 'src/helpers/testHelpers/auth0';
const item = {
  avatarUrl: 'test',
  followers: [{ user: 'testId' }],
  id: 'testId',
  name: 'test',
  sport: 'football',
};
const props: any = {
  item,
};
const emptyProps: any = {};

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
            <ItemCard {...emptyProps} />
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
            <ItemCard {...props} />
          </Router>
        </ToastProvider>
      </MockedProvider>,
    );

    expect(wrapper.find('figure')).toHaveLength(1);
    wrapper.unmount();
  });
});
