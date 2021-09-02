import { InfluencerProfileQuery, UpdateInfluencerProfileMutation } from 'src/apollo/queries/profile';
import Form from 'src/components/Form/Form';
import { InfluencerProfileEditPage } from '../InfluencerProfileEditPage';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { InMemoryCache } from '@apollo/client';
import Layout from 'src/components/Layout';
import { act } from 'react-dom/test-utils';
import { ToastProvider } from 'react-toast-notifications';

const mockHistoryFn = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    influencerId: 'testId',
  }),
  useHistory: () => ({
    replace: mockHistoryFn,
    goBack: mockHistoryFn,
  }),
}));

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();
const nullDataCache = new InMemoryCache();

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
nullDataCache.writeQuery({
  query: InfluencerProfileQuery,
  variables: { id: 'testId' },
  data: {
    influencer: null,
  },
});

const mockFn = jest.fn();

const mocks = [
  {
    request: {
      query: UpdateInfluencerProfileMutation,
      variables: { name: 'test', sport: 'test', team: 'test', profileDescription: 'test', influencerId: 'testId' },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          updateInfluencerProfile: {
            id: 'testId',
            name: 'test',
            sport: 'test',
            team: 'test',
            profileDescription: 'test',
            avatarUrl: 'test',
            status: 'ONBOARDED',
          },
        },
      };
    },
  },
];

const submitValues = {
  name: 'test',
  sport: 'test',
  team: 'test',
  profileDescription: 'test',
  favoriteCharities: [{ id: 'testId', name: 'test' }],
};

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
  it('should redirect to 404', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={nullDataCache}>
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
    expect(mockHistoryFn).toBeCalled();
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
  it('should submit form and call the mutation', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache} mocks={mocks}>
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
    await act(async () => {
      wrapper!
        .find(Form)
        .props()
        .onSubmit({ ...submitValues });

      expect(mockFn).toHaveBeenCalledTimes(1);

      expect(mockHistoryFn).toHaveBeenCalledTimes(0);
    });
  });
});
