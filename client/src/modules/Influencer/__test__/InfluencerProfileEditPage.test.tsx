import { InfluencerProfileQuery } from 'src/apollo/queries/profile';
import { InfluencerProfileEditPage } from '../InfluencerProfileEditPage';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { InMemoryCache } from '@apollo/client';
import Layout from 'src/components/Layout';
import { act } from 'react-dom/test-utils';
import { ToastProvider } from 'react-toast-notifications';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    influencerId: 'testId',
  }),
  useRouteMatch: () => ({ url: '/profiles/testId' }),
}));

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();

cache.writeQuery({
  query: InfluencerProfileQuery,
  variables: { id: 'testId' },

  data: {
    influencer: {
      avatarUrl: 'test',
      favoriteCharities: [],
      id: 'testId',
      name: 'test',
      profileDescription: 'test',
      sport: 'test',
      status: 'ONBOARDED',
      team: 'test',
    },
  },
});

describe('InfluencerProfileEditPage ', () => {
  it('component return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <InfluencerProfileEditPage />
            </MockedProvider>
          </ToastProvider>
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
              <InfluencerProfileEditPage />
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
  });
});
