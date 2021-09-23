import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ToastProvider } from 'react-toast-notifications';

import { GetInfluencerQuery } from '../../../apollo/queries/influencers';
import { InfluencerProfilePageContent } from 'src/modules/Influencer/InfluencerProfilePage/InfluencerProfilePageContent';

import { InfluencerProfilePage } from '../InfluencerProfilePage/InfluencerProfilePage';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const mockHistoryFn = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    influencerId: 'testId',
  }),
  useHistory: () => ({
    replace: mockHistoryFn,
  }),
}));

const cache = new InMemoryCache();

const nullDataCache = new InMemoryCache();

cache.writeQuery({
  query: GetInfluencerQuery,
  variables: { id: 'testId' },
  data: {
    influencer: {
      auctions: [],
      avatarUrl: 'test.webp',
      totalRaisedAmount: 0,
      followers: [{ user: 'testId', createdAt: '2021-06-18T12:11:15.092Z' }],
      id: 'testId',
      name: 'test',
      profileDescription: 'test',
      sport: 'test',
      status: 'ONBOARDED',
      team: 'test',
    },
  },
});

nullDataCache.writeQuery({
  query: GetInfluencerQuery,
  variables: { id: 'testId' },
  data: {
    influencer: null,
  },
});
describe('InfluencerProfilePage', () => {
  it('component return null', () => {
    let wrapper: ReactWrapper;
    wrapper = mount(
      <Router>
        <MockedProvider>
          <InfluencerProfilePage />
        </MockedProvider>
      </Router>,
    );
    expect(wrapper.find(InfluencerProfilePageContent)).toHaveLength(0);
  });

  it('renders without crashing', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <Router>
            <MockedProvider cache={cache}>
              <InfluencerProfilePage />
            </MockedProvider>
          </Router>
        </ToastProvider>,
      );
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();

      expect(wrapper.find(InfluencerProfilePageContent)).toHaveLength(1);
    });
  });
  it('component should redirect to 404 page', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <Router>
            <MockedProvider cache={nullDataCache}>
              <InfluencerProfilePage />
            </MockedProvider>
          </Router>
        </ToastProvider>,
      );
      await new Promise((resolve) => setTimeout(resolve));

      expect(mockHistoryFn).toBeCalled();
    });
  });
});
