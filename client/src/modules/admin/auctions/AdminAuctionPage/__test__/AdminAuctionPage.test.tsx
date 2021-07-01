import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render, wait } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { CustomerInformation, AuctionForAdminPage } from 'src/apollo/queries/auctions';
import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import { auctionForAdminPage } from 'src/helpers/testHelpers/auction';
import AdminAuctionPage from '..';

const mocks: any[] = [
  {
    request: {
      query: AuctionForAdminPage,
      variables: {
        id: 'testId',
      },
    },
    result: {
      data: auctionForAdminPage,
      error: [],
      loading: false,
    },
  },
  {
    request: {
      query: CustomerInformation,
      variables: { stripeCustomerId: 'test' },
    },
    result: {
      data: { email: 'test@gmail.com', phone: '+15042010052' },
      loading: false,
    },
  },
];
describe('Should render correctly "AdminAuctionPage"', () => {
  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <Router>
        <ToastProvider>
          <MockedProvider
            mocks={mocks}
            defaultOptions={{
              watchQuery: { fetchPolicy: 'no-cache' },
              query: { fetchPolicy: 'no-cache' },
            }}
          >
            <AdminAuctionPage />
          </MockedProvider>
        </ToastProvider>
      </Router>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
