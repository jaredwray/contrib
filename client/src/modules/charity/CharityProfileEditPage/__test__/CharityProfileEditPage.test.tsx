import { GetCharity } from 'src/apollo/queries/charityProfile';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { InMemoryCache } from '@apollo/client';
import Layout from 'src/components/Layout';
import { act } from 'react-dom/test-utils';
import { ToastProvider } from 'react-toast-notifications';
import { CharityProfileEditPage } from '../CharityProfileEditPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    charityId: 'testId',
  }),
  useRouteMatch: () => ({ url: '/profiles/testId' }),
}));

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const cache = new InMemoryCache();

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
});
