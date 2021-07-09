import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { AuctionQuery } from 'src/apollo/queries/auctions';
import { MemoryRouter } from 'react-router-dom';
import { InMemoryCache } from '@apollo/client';
import Layout from 'src/components/Layout';
import { act } from 'react-dom/test-utils';
import AuctionDonePage from 'src/modules/auctions/editAuction/DonePage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    auctionId: '60d0f0f4f7714a2f8ae247df',
  }),
  useRouteMatch: () => ({ url: '/auctions/60d0f0f4f7714a2f8ae247df/done' }),
}));

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();

cache.writeQuery({
  query: AuctionQuery,
  variables: { id: '60d0f0f4f7714a2f8ae247df' },
  data: {
    auction: {
      attachments: [],
      auctionOrganizer: {
        id: '602fd93aab319f3eea16a1a6',
        name: 'Bob',
        avatarUrl: 'https://storage.googleapis.com/content-dev.contrib.org/602fd93aab319f3eea16a1a6/avatar/avatar.webp',
      },
      authenticityCertificate: false,
      autographed: false,
      bids: [],
      charity: {
        id: '60c1f579ff49a51d6f2ee61b',
        name: 'My Active Charity Name',
        avatarUrl: '/content/img/users/person.png',
        websiteUrl: 'http://google.com',
      },
      currentPrice: { amount: 112200, currency: 'USD', precision: 2 },
      description: 'dd',
      endDate: '2021-08-29T08:05:21.000Z',
      fairMarketValue: null,
      followers: [],
      fullPageDescription: 'dd',
      gameWorn: false,
      id: '60d0f0f4f7714a2f8ae247df',
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
  xit('component is defined and have Layout', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <MockedProvider cache={cache}>
            <AuctionDonePage />
          </MockedProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(wrapper!).toHaveLength(1);
    expect(wrapper!.find(Layout)).toHaveLength(1);
  });
});
