import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { InMemoryCache } from '@apollo/client';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';

import Layout from 'src/components/Layout';
import Form from 'src/components/Form/Form';
import { CharityProfileEditPage } from '../CharityProfileEditPage';
import { GetCharity, UpdateCharityProfileMutation } from 'src/apollo/queries/charityProfile';

const mockHistoryFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    charityId: 'testId',
  }),
  useHistory: () => ({
    replace: mockHistoryFn,
    location: { pathname: '/' },
  }),
  useRouteMatch: () => ({ url: '/profiles/testId' }),
}));

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();

const nullDataCache = new InMemoryCache();

cache.writeQuery({
  query: GetCharity,
  variables: { id: 'testId' },

  data: {
    charity: {
      avatarUrl: 'test',
      followers: [{ createdAt: '2021-06-21T17:11:07.220Z', user: 'testId' }],
      id: 'testId',
      name: 'test',
      profileDescription: 'test',
      status: 'ACTIVE',
      website: 'test',
      websiteUrl: 'http://123',
    },
  },
});

nullDataCache.writeQuery({
  query: GetCharity,
  variables: { id: 'testId' },
  data: { charity: null },
});

const mockFn = jest.fn();

const mocks = [
  {
    request: {
      query: UpdateCharityProfileMutation,
      variables: { charityId: 'testId', name: 'test', website: 'test', profileDescription: 'test' },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          updateCharityProfile: {
            id: 'testId',
            name: 'test',
            profileDescription: 'test',
            website: 'test',
          },
        },
      };
    },
  },
];
describe('CharityProfileEditPage ', () => {
  it('component return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <CharityProfileEditPage />
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
              <CharityProfileEditPage />
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
  it('component should redirect to 404 page', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={nullDataCache}>
              <CharityProfileEditPage />
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
  it('should submit form and call the mutation', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache} mocks={mocks}>
              <CharityProfileEditPage />
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
      wrapper!.find(Form).props().onSubmit({
        name: 'test',
        website: 'test',
        profileDescription: 'test',
      });
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
