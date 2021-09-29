import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import PhoneInput from 'react-phone-input-2';

import Layout from 'src/components/layouts/Layout';
import Form from 'src/components/forms/Form/Form';
import InputField from 'src/components/forms/inputs/InputField';
import { AuctionQuery } from 'src/apollo/queries/auctions';
import { testAccount } from 'src/helpers/testHelpers/account';
import { AuctionQueryAuction } from 'src/helpers/testHelpers/auction';
import { CreateOrUpdateUserAddressMutation } from 'src/apollo/queries/accountQuery';
import { withAuthenticatedUser, mockedUseAuth0 } from 'src/helpers/testHelpers/auth0';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';

import DeliveryAddressPage from '..';

const mockHistoryFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryFn,
    push: mockHistoryFn,
  }),
  useParams: () => ({
    auctionId: 'testId',
  }),
}));

const cache = new InMemoryCache();
const cache2 = new InMemoryCache();
const cache3 = new InMemoryCache();

cache.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: {
    auction: AuctionQueryAuction,
  },
});
cache2.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: {
    auction: {
      ...AuctionQueryAuction,
      winner: { ...AuctionQueryAuction.winner, mongodbId: 'ttestId' },
    },
  },
});
cache3.writeQuery({
  query: AuctionQuery,
  variables: { id: 'testId' },
  data: {
    auction: {
      ...AuctionQueryAuction,
      delivery: { ...AuctionQueryAuction.delivery, status: 'DELIVERY_PAID' },
      winner: { ...AuctionQueryAuction.winner, mongodbId: 'ttestId' },
    },
  },
});

const mockFn = jest.fn();

const mocks = [
  {
    request: {
      query: CreateOrUpdateUserAddressMutation,
      variables: {
        auctionId: 'testId',
        city: 'Phoenix',
        name: 'test',
        state: 'AZ',
        street: 'test',
        zipCode: '85027',
        phoneNumber: '+1',
      },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          createOrUpdateUserAddress: {
            state: 'AZ',
            city: 'Phoenix',
            zipCode: '85027',
            street: 'test',
            phoneNumber: '+1',
          },
        },
      };
    },
  },
];
const errorMocks = [
  {
    request: {
      query: CreateOrUpdateUserAddressMutation,
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

const submitValues = {
  city: 'Phoenix',
  name: 'test',
  state: 'AZ',
  street: 'test',
  zipCode: '85027',
};
describe('DeliveryAddressPage', () => {
  beforeEach(() => {
    withAuthenticatedUser();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component returns null', async () => {
    let wrapper: ReactWrapper;

    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <UserAccountContext.Provider value={testAccount}>
            <MockedProvider>
              <DeliveryAddressPage />
            </MockedProvider>
          </UserAccountContext.Provider>
        </ToastProvider>,
      );
      await new Promise((resolve) => setTimeout(resolve));
    });
    expect(wrapper!.find(Layout)).toHaveLength(0);
  });
  it('component should redirect without account', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={{ account: null }}>
              <MockedProvider cache={cache}>
                <DeliveryAddressPage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
      await new Promise((resolve) => setTimeout(resolve));
    });
    expect(mockedUseAuth0().loginWithRedirect).toHaveBeenCalled();
  });
  it('component should redirect becouse of status PAID', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache3}>
                <DeliveryAddressPage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
      await new Promise((resolve) => setTimeout(resolve));
      expect(mockHistoryFn).toHaveBeenCalled();
    });
  });
  it('component should redirect without winner', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache}>
                <DeliveryAddressPage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
      await new Promise((resolve) => setTimeout(resolve));
      expect(mockHistoryFn).toHaveBeenCalled();
    });
  });
  it('should submit form and not call the mutation becouse of none submit values', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache2} mocks={mocks}>
                <DeliveryAddressPage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
    });
    await act(async () => {
      wrapper!.find(Form).props().onSubmit({});
    });
    expect(mockFn).toHaveBeenCalledTimes(0);

    wrapper!.find(InputField).last().children().find('input').simulate('keypress', { key: 'q' });

    wrapper!
      .find(PhoneInput)
      .children()
      .find('input')
      .simulate('change', { target: { value: '1' } });
    expect(wrapper!.find(PhoneInput).props().value).toEqual('+1');
  });
  it('should submit form and call the mutation', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache2} mocks={mocks}>
                <DeliveryAddressPage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });

    await act(async () => {
      wrapper!.find(Form).props().onSubmit(submitValues);
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  it('should submit form and not call the mutation', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache2} mocks={errorMocks}>
                <DeliveryAddressPage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });

    await act(async () => {
      wrapper!.find(Form).props().onSubmit(submitValues);
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});
