import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';
import { BrowserRouter as Router } from 'react-router-dom';
import WatchBtn from 'src/components/buttons/WatchBtn';
import ShareBtn from 'src/modules/auctions/AuctionPage/GeneralInformation/ShareBtn';
import { AuctionQueryAuction } from 'src/helpers/testHelpers/auction';
import { FollowAuctionMutation, UnfollowAuctionMutation } from 'src/apollo/queries/auctions';
import * as auth from 'src/helpers/useAuth';

import AuctionDetails from '..';

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

const withAuthUser = () => {
  const spy = jest.spyOn(auth, 'useAuth');
  spy.mockReturnValue({
    isAuthenticated: true,
  });
};

describe('AuctionDetails', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders without crashing', () => {
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
});
