import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { InMemoryCache } from '@apollo/client';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';

import Layout from 'src/components/Layout';
import { ToastProvider } from 'react-toast-notifications';
import { GetAuctionBasicsQuery } from 'src/apollo/queries/auctions';
import EditAuctionBasicPage from '../BasicPage/Edit';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    auctionId: 'testId',
  }),
  useRouteMatch: () => ({ url: '/admin/auctions/testId' }),
}));

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();

cache.writeQuery({
  query: GetAuctionBasicsQuery,
  variables: {
    id: 'testId',
  },
  data: {
    auction: {
      auctionOrganizer: { id: 'testId' },
      authenticityCertificate: false,
      autographed: false,
      description: 'test',
      fullPageDescription: 'test',
      gameWorn: false,
      id: 'testId',
      isActive: false,
      link: 'test',
      playedIn: null,
      sport: 'asd',
      status: 'DRAFT',
      title: 'asd',
    },
  },
});

describe('EditAuctionBasicPage ', () => {
  it('component return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <EditAuctionBasicPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );

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
              <EditAuctionBasicPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );

      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();

      expect(wrapper!).toHaveLength(1);
      expect(wrapper!.find(Layout)).toHaveLength(1);
    });
  });
});
