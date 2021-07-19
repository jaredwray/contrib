import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { AuctionQuery } from 'src/apollo/queries/auctions';
import { MemoryRouter } from 'react-router-dom';
import { InMemoryCache } from '@apollo/client';
import Layout from 'src/components/Layout';
import { act } from 'react-dom/test-utils';
import AuctionDonePage from 'src/modules/auctions/editAuction/DonePage';
import { ToastProvider } from 'react-toast-notifications';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    auctionId: 'testId',
  }),
  useRouteMatch: () => ({ url: '/auctions/testId/done' }),
}));
jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());
jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();

cache.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: {
    auction: {
      attachments: [{ cloudflareUrl: null, thumbnail: null, type: 'IMAGE', uid: null, url: 'test' }],
      auctionOrganizer: {
        id: 'test',
        name: 'test',
        avatarUrl: 'test',
      },
      authenticityCertificate: false,
      autographed: false,
      bids: [
        {
          bid: { amount: 11222200, precision: 2 },
          createdAt: 'test',
          paymentSource: 'test',
          user: 'test',
        },
      ],
      charity: {
        avatarUrl: '/content/img/users/person.png',
        id: 'test',
        name: 'My Active Charity Name',
        status: 'ACTIVE',
        websiteUrl: 'http://google.com',
      },
      currentPrice: { amount: 112200, currency: 'USD', precision: 2 },
      description: 'dd',
      endDate: '2021-08-29T08:05:21.000Z',
      fairMarketValue: null,
      followers: [{ createdAt: '2021-06-28T12:52:49.463Z', user: '60d9ac0f650c813a783906b0' }],
      fullPageDescription: 'dd',
      gameWorn: false,
      id: 'testId',
      isActive: true,
      isDraft: false,
      isFailed: false,
      isPending: false,
      isSettled: false,
      isSold: false,
      isStopped: false,
      itemPrice: { amount: 10000, currency: 'USD', precision: 2 },
      link: 'https://go.contrib.org/3d1Hwvn',
      playedIn: null,
      startDate: '2021-06-21T08:05:21.000Z',
      startPrice: { amount: 33300, currency: 'USD', precision: 2 },
      status: 'ACTIVE',
      stoppedAt: null,
      timeZone: 'PDT',
      title: 'dd',
      totalBids: 1,
    },
  },
});

describe('DonePage ', () => {
  it('component return null', async () => {
    let wrapper: ReactWrapper;
    window.prompt = () => {};
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <MockedProvider>
            <AuctionDonePage />
          </MockedProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(wrapper!.find(Layout)).toHaveLength(0);
  });
  it('component is defined and has Layout', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache}>
              <AuctionDonePage />
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
    expect(wrapper!.find(Layout)).toHaveLength(1);
    wrapper!.find('ShareButton').last().children().find('Button').first().simulate('click');
    wrapper!.find('CopyToClipboard').children().find('Button').simulate('click');
  });
});
