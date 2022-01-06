import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';

import HeartBtn from 'src/components/buttons/HeartButton';
import ItemCard from 'src/components/layouts/AllItemsLayout/ItemCard';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { FollowCharity, UnfollowCharity } from 'src/apollo/queries/charityProfile';
import { FollowInfluencer, UnfollowInfluencer } from 'src/apollo/queries/influencers';
import * as auth from 'src/helpers/useAuth';

const item = {
  avatarUrl: 'test',
  followers: [{ user: 'testId' }],
  id: 'testId',
  name: 'test',
  sport: 'football',
};
const props: any = {
  path: 'test',
  item,
  isCharity: false,
};
const props2: any = {
  path: 'test',
  item,
  isCharity: true,
};
const emptyProps: any = { path: 'test' };
const mockFn = jest.fn();
const mockFollowCharity = jest.fn();

const mocks = [
  {
    request: {
      query: UnfollowInfluencer,
      variables: {
        influencerId: 'testId',
      },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          unfollowInfluencer: {
            id: 'testId',
          },
        },
      };
    },
  },
  {
    request: {
      query: FollowInfluencer,
      variables: {
        influencerId: 'testId',
      },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          unfollowInfluencer: {
            user: 'testId',
            createdAt: 'test Date',
          },
        },
      };
    },
  },
  {
    request: {
      query: FollowCharity,
      variables: {
        charityId: 'testId',
      },
    },
    newData: () => {
      mockFollowCharity();
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
const errorMocks = [
  {
    request: {
      query: UnfollowInfluencer,
      variables: {},
    },
    newData: () => {
      mockFn();
      return {
        data: {},
      };
    },
  },
  {
    request: {
      query: FollowInfluencer,
      variables: {},
    },
    newData: () => {
      mockFn();
      return {
        data: {},
      };
    },
  },
  {
    request: {
      query: FollowCharity,
      variables: {},
    },
    newData: () => {
      mockFn();
      return {
        data: {},
      };
    },
  },
  {
    request: {
      query: UnfollowCharity,
      variables: {},
    },
    newData: () => {
      mockFn();
      return {
        data: {},
      };
    },
  },
];

const withAuthUser = () => {
  const spy = jest.spyOn(auth, 'useAuth');
  spy.mockReturnValue({
    isAuthenticated: true,
  });
};

const withNotAuthUser = () => {
  const spy = jest.spyOn(auth, 'useAuth');
  spy.mockReturnValue({
    isAuthenticated: false,
  });
};

describe('Should render correctly "AuctionCard"', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());

  it('component return null', () => {
    withAuthUser();
    const wrapper = mount(
      <MockedProvider>
        <ToastProvider>
          <Router>
            <ItemCard {...emptyProps} />
          </Router>
        </ToastProvider>
      </MockedProvider>,
    );
    expect(wrapper.find('figure')).toHaveLength(0);
    wrapper.unmount();
  });
  it('component is defined', () => {
    withAuthUser();
    const wrapper = mount(
      <MockedProvider>
        <ToastProvider>
          <Router>
            <ItemCard {...props} />
          </Router>
        </ToastProvider>
      </MockedProvider>,
    );

    expect(wrapper.find('figure')).toHaveLength(1);
    wrapper.unmount();
  });
  it('should redirect and not call FollowInfluencer mutation', async () => {
    withNotAuthUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <Router>
            <MockedProvider mocks={mocks}>
              <ItemCard {...props} />
            </MockedProvider>
          </Router>
        </ToastProvider>,
      );
    });
    await act(async () => {
      wrapper!.find(HeartBtn).prop('followHandler')!();
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
  it('should call FollowInfluencer mutation', async () => {
    withAuthUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider mocks={mocks}>
              <ItemCard {...props} />
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
      wrapper!.find(HeartBtn).prop('followHandler')!();
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  it('should call UnfollowInfluencer mutation', async () => {
    withAuthUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider mocks={mocks}>
              <ItemCard {...props} />
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
      wrapper!.find(HeartBtn).prop('unfollowHandler')!();
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  it('should not call FollowInfluencer mutation becouse of error', async () => {
    withAuthUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider mocks={errorMocks}>
              <ItemCard {...props} />
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
      wrapper!.find(HeartBtn).prop('followHandler')!();
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
  it('should not call UnfollowInfluencer mutation becouse of error', async () => {
    withAuthUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider mocks={errorMocks}>
              <ItemCard {...props} />
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
      wrapper!.find(HeartBtn).prop('unfollowHandler')!();
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
  it('should redirect and not call FollowCharity mutation', async () => {
    withNotAuthUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider mocks={mocks}>
              <ItemCard {...props2} />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      wrapper!.find(HeartBtn).prop('followHandler')!();
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFollowCharity).toHaveBeenCalledTimes(0);
  });
  it('should call FollowCharity mutation', async () => {
    withAuthUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider mocks={mocks}>
              <ItemCard {...props2} />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      wrapper!.find(HeartBtn).prop('followHandler')!();
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFollowCharity).toHaveBeenCalledTimes(1);
  });
  it('should call UnfollowCharity mutation', async () => {
    withAuthUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider mocks={mocks}>
              <ItemCard {...props2} />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      wrapper!.find(HeartBtn).prop('unfollowHandler')!();
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  it('should not call FollowCharity mutation becouse of error', async () => {
    withAuthUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider mocks={errorMocks}>
              <ItemCard {...props2} />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      wrapper!.find(HeartBtn).prop('followHandler')!();
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
  it('should not call UnfollowCharity mutation becouse of error', async () => {
    withAuthUser();
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider mocks={errorMocks}>
              <ItemCard {...props2} />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      wrapper!.find(HeartBtn).prop('unfollowHandler')!();
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});
