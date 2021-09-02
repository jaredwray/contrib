import { mount, ReactWrapper } from 'enzyme';
import { DineroObject } from 'dinero.js';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';

import Layout from 'src/components/Layout';
import WatchBtn from 'src/components/WatchBtn';
import { ContribApolloProvider } from 'src/apollo/ContribApolloProvider';
import { CharityProfilePageContent } from '../CharityProfilePageContent';
import { FollowCharity, UnfollowCharity } from 'src/apollo/queries/charityProfile';
import { withAuthenticatedUser, withNotAuthenticatedUser, mockedUseAuth0 } from 'src/helpers/testHelpers/auth0';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  charity: {
    avatarUrl: 'test',
    followers: [{ createdAt: '2021-06-21T17:11:07.220Z', user: 'test' }],
    id: 'testId',
    name: 'test',
    profileDescription: 'test',
    status: 'ACTIVE',
    website: 'test',
    websiteUrl: 'test',
  },
  totalRaisedAmount: {} as DineroObject,
};
const newProps: any = {
  ...props,
  charity: {
    ...props.charity,
    status: 'INACTIVE',
  },
};
jest.mock('@auth0/auth0-react');

const mockFn = jest.fn();

const mocks = [
  {
    request: {
      query: FollowCharity,
      variables: {
        charityId: 'testId',
      },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          followCharity: {
            user: 'testId',
            createdAt: 'test Date',
          },
        },
      };
    },
  },
  {
    request: {
      query: UnfollowCharity,
      variables: {
        charityId: 'testId',
      },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          unfollowCharity: {
            id: 'testId',
          },
        },
      };
    },
  },
];
describe('Should render correctly "CharityProfilePageContent"', () => {
  beforeAll(() => {
    process.env = { ...process.env, REACT_APP_API_URL: 'https://dev.contrib.org/graphql' };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('component return null', () => {
    withAuthenticatedUser();
    const wrapper = mount(
      <MemoryRouter>
        <ToastProvider>
          <MockedProvider>
            <CharityProfilePageContent {...newProps} />
          </MockedProvider>
        </ToastProvider>
      </MemoryRouter>,
    );
    expect(wrapper.find(Layout)).toHaveLength(0);
  });
  it('component is defined', () => {
    withAuthenticatedUser();
    const wrapper = mount(
      <MemoryRouter>
        <ToastProvider>
          <MockedProvider>
            <CharityProfilePageContent {...props} />
          </MockedProvider>
        </ToastProvider>
      </MemoryRouter>,
    );
    expect(wrapper.find(Layout)).toHaveLength(1);
  });
  it('should redirect and not call FollowCharity mutation', async () => {
    withNotAuthenticatedUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider mocks={mocks}>
              <CharityProfilePageContent {...props} />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      wrapper!.find(WatchBtn).prop('followHandler')!();
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockedUseAuth0().loginWithRedirect).toHaveBeenCalled();
  });
  it('should call FollowCharity mutation', async () => {
    withAuthenticatedUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider mocks={mocks}>
              <CharityProfilePageContent {...props} />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      wrapper!.find(WatchBtn).prop('followHandler')!();
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  it('should call UnfollowCharity mutation', async () => {
    withAuthenticatedUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider mocks={mocks}>
              <CharityProfilePageContent {...props} />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      wrapper!.find(WatchBtn).prop('unfollowHandler')!();
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
