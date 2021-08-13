import { MyProfileQuery } from 'src/apollo/queries/profile';

import { InfluencerOnboardingCharitiesPage } from '../InfluencerOnboardingCharitiesPage';
import { UpdateMyFavoriteCharities } from 'src/apollo/queries/charities';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ToastProvider } from 'react-toast-notifications';
import { MemoryRouter } from 'react-router-dom';
import Layout from 'src/components/Layout';
import Form from 'src/components/Form/Form';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

cache.writeQuery({
  query: MyProfileQuery,
  data: {
    myAccount: {
      influencerProfile: {
        avatarUrl: '/content/img/users/person.png',
        favoriteCharities: [],
        id: '6113d38d4364102ae02c69cc',
        name: 'test test',
        profileDescription: '1',
        sport: '1',
        status: 'ONBOARDED',
        team: '1',
      },
    },
  },
});
const mockFn = jest.fn();

const mocks = [
  {
    request: {
      query: UpdateMyFavoriteCharities,
      variables: { charities: ['testId'] },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          updateMyInfluencerProfileFavoriteCharities: {
            id: 'testId',
            name: 'test',
          },
        },
      };
    },
  },
];

describe('InfluencerOnboardingBasicPage ', () => {
  it('component return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <InfluencerOnboardingCharitiesPage />
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
  it('should submit form and call the mutation', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache} mocks={mocks}>
              <InfluencerOnboardingCharitiesPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();

      expect(wrapper!).toHaveLength(1);
      expect(wrapper!.find(Layout)).toHaveLength(1);
    });
    await act(async () => {
      wrapper!
        .find(Form)
        .props()
        .onSubmit({
          favoriteCharities: [{ id: 'testId', name: 'test', profileStatus: 'COMPLETED', status: 'ACTIVE' }],
        });
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
