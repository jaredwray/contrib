import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';
import { BrowserRouter as Router } from 'react-router-dom';
import WatchBtn from 'src/components/buttons/WatchBtn';
import ShareBtn from 'src/modules/auctions/AuctionPage/AuctionDetails/ShareBtn';
import { AuctionQueryAuction } from 'src/helpers/testHelpers/auction';
import { FollowAuctionMutation, UnfollowAuctionMutation } from 'src/apollo/queries/auctions';
import { withAuthenticatedUser, withNotAuthenticatedUser, mockedUseAuth0 } from 'src/helpers/testHelpers/auth0';

import AuctionDetails from '..';

jest.mock('@auth0/auth0-react');
jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    auctionId: 'testId',
  }),
}));

const props: any = {
  auction: AuctionQueryAuction,
};

const mockFn = jest.fn();

const mocks = [
  {
    request: {
      query: FollowAuctionMutation,
      variables: {
        auctionId: 'testId',
      },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          followAuction: {
            user: 'testId',
            createdAt: 'test Date',
          },
        },
      };
    },
  },
  {
    request: {
      query: UnfollowAuctionMutation,
      variables: {
        auctionId: 'testId',
      },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          unfollowAuction: {
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
      query: FollowAuctionMutation,
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
      query: UnfollowAuctionMutation,
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

describe('AuctionDetails', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders without crashing', () => {
    withAuthenticatedUser();
    let wrapper: ReactWrapper;
    (wrapper = mount(
      <Router>
        <ToastProvider>
          <MockedProvider>
            <AuctionDetails {...props} />
          </MockedProvider>
        </ToastProvider>
      </Router>,
    )),
      expect(wrapper).toHaveLength(1);
  });

  describe('when auction is not active', () => {
    it('should not display WatchBtn', async () => {
      withNotAuthenticatedUser();
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <Router>
            <ToastProvider>
              <MockedProvider mocks={mocks}>
                <AuctionDetails {...props} />
              </MockedProvider>
            </ToastProvider>
          </Router>,
        );
      });
      expect(wrapper.find(WatchBtn)).toHaveLength(0);
    });
    it('should display ShareBtn', async () => {
      withNotAuthenticatedUser();
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <Router>
            <ToastProvider>
              <MockedProvider mocks={mocks}>
                <AuctionDetails {...props} />
              </MockedProvider>
            </ToastProvider>
          </Router>,
        );
      });
      expect(wrapper.find(ShareBtn)).toHaveLength(1);
    });
  });
  describe('when auction is active', () => {
    beforeEach(() => {
      AuctionQueryAuction['isActive'] = true;
      AuctionQueryAuction['isStopped'] = false;
    });
    it('should display ShareBtn', async () => {
      withNotAuthenticatedUser();
      let wrapper: ReactWrapper;
      await act(async () => {
        wrapper = mount(
          <Router>
            <ToastProvider>
              <MockedProvider mocks={mocks}>
                <AuctionDetails {...props} />
              </MockedProvider>
            </ToastProvider>
          </Router>,
        );
      });
      expect(wrapper.find(ShareBtn)).toHaveLength(1);
    });
    describe('watch button', () => {
      it('should display WatchBtn', async () => {
        withNotAuthenticatedUser();
        let wrapper: ReactWrapper;
        await act(async () => {
          wrapper = mount(
            <Router>
              <ToastProvider>
                <MockedProvider mocks={mocks}>
                  <AuctionDetails {...props} />
                </MockedProvider>
              </ToastProvider>
            </Router>,
          );
        });
        expect(wrapper.find(WatchBtn)).toHaveLength(1);
      });
      it('should redirect and not call followAuction mutation', async () => {
        withNotAuthenticatedUser();
        let wrapper: ReactWrapper;
        await act(async () => {
          wrapper = mount(
            <Router>
              <ToastProvider>
                <MockedProvider mocks={mocks}>
                  <AuctionDetails {...props} />
                </MockedProvider>
              </ToastProvider>
            </Router>,
          );
        });
        await act(async () => {
          wrapper!.find(WatchBtn).prop('followHandler')!();
        });
        await new Promise((resolve) => setTimeout(resolve));
        expect(mockedUseAuth0().loginWithRedirect).toHaveBeenCalled();
      });
      it('should call followAuction mutation', async () => {
        withAuthenticatedUser();
        let wrapper: ReactWrapper;
        await act(async () => {
          wrapper = mount(
            <Router>
              <ToastProvider>
                <MockedProvider mocks={mocks}>
                  <AuctionDetails {...props} />
                </MockedProvider>
              </ToastProvider>
            </Router>,
          );
        });
        await act(async () => {
          wrapper!.find(WatchBtn).prop('followHandler')!();
        });
        await new Promise((resolve) => setTimeout(resolve));
        expect(mockFn).toHaveBeenCalledTimes(1);
      });
      it('should call UnfollowAuction mutation', async () => {
        withAuthenticatedUser();
        let wrapper: ReactWrapper;
        await act(async () => {
          wrapper = mount(
            <Router>
              <ToastProvider>
                <MockedProvider mocks={mocks}>
                  <AuctionDetails {...props} />
                </MockedProvider>
              </ToastProvider>
            </Router>,
          );
        });
        await act(async () => {
          wrapper!.find(WatchBtn).prop('unfollowHandler')!();
        });
        await new Promise((resolve) => setTimeout(resolve));
        expect(mockFn).toHaveBeenCalledTimes(1);
      });
      it('should not call followAuction mutation becouse of error', async () => {
        withAuthenticatedUser();
        let wrapper: ReactWrapper;
        await act(async () => {
          wrapper = mount(
            <Router>
              <ToastProvider>
                <MockedProvider mocks={errorMocks}>
                  <AuctionDetails {...props} />
                </MockedProvider>
              </ToastProvider>
            </Router>,
          );
        });
        await act(async () => {
          wrapper!.find(WatchBtn).prop('followHandler')!();
        });
        await new Promise((resolve) => setTimeout(resolve));
        expect(mockFn).toHaveBeenCalledTimes(0);
      });
      it('should not call UnfollowAuction mutation becouse of error', async () => {
        withAuthenticatedUser();
        let wrapper: ReactWrapper;
        await act(async () => {
          wrapper = mount(
            <Router>
              <ToastProvider>
                <MockedProvider mocks={errorMocks}>
                  <AuctionDetails {...props} />
                </MockedProvider>
              </ToastProvider>
            </Router>,
          );
        });
        await act(async () => {
          wrapper!.find(WatchBtn).prop('unfollowHandler')!();
        });
        await new Promise((resolve) => setTimeout(resolve));
        expect(mockFn).toHaveBeenCalledTimes(0);
      });
    });
  });
});
