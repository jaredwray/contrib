import { mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';

import * as auth from 'src/helpers/useAuth';
import { MyAccountQuery } from 'src/apollo/queries/accountQuery';
import { UserAccountStatus } from 'src/types/UserAccount';
import { UserAccountProvider } from 'src/components/helpers/UserAccountProvider/UserAccountProvider';

const props = {
  children: <></>,
};

delete window.location;
window.location = { ...window.location, href: 'test' };

const defaultAccount = {
  id: '123',
  phoneNumber: '123',
  status: UserAccountStatus.COMPLETED,
  influencerProfile: null,
  isAdmin: false,
  createdAt: '2021-02-18T14:36:35.208+00:00',
  notAcceptedTerms: null,
  assistant: null,
  paymentInformation: null,
  mongodbId: '321',
  charity: {
    id: 'test',
    name: 'test',
    status: 'test',
    profileStatus: 'test',
    stripeStatus: null,
    stripeAccountLink: 'stripeLink',
  },
  address: {
    name: 'test name',
    state: 'test state',
    city: 'test city',
    zipCode: 'test zipCode',
    country: 'test country',
    street: 'test street',
  },
};

const cacheAccountWithCharity = new InMemoryCache();
const cacheAccountConfirmNumber = new InMemoryCache();
const cacheAccountNumberRequired = new InMemoryCache();
const cacheAccountInfluencerWithoutDescription = new InMemoryCache();

cacheAccountWithCharity.writeQuery({
  query: MyAccountQuery,
  data: {
    myAccount: defaultAccount,
  },
});

cacheAccountConfirmNumber.writeQuery({
  query: MyAccountQuery,
  data: {
    myAccount: { ...defaultAccount, status: UserAccountStatus.PHONE_NUMBER_REQUIRED },
  },
});

cacheAccountNumberRequired.writeQuery({
  query: MyAccountQuery,
  data: {
    myAccount: { ...defaultAccount, status: UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED },
  },
});

cacheAccountInfluencerWithoutDescription.writeQuery({
  query: MyAccountQuery,
  data: {
    myAccount: {
      ...defaultAccount,
      influencerProfile: {
        avatarUrl: 'test',
        id: 'test',
        name: 'test',
        profileDescription: null,
        sport: '1',
        status: 'TRANSIENT',
        team: '1',
        favoriteCharities: [],
      },
    },
  },
});

describe('UserAccountProvider', () => {
  beforeEach(async () => {
    const verifiedUser = {
      email: 'johndoe@me.com',
      email_verified: true,
      name: 'Julian Strait',
      picture: 'link-to-a-picture',
      id: 'google-oauth2|12345678901234',
    };

    const spy = jest.spyOn(auth, 'useAuth');
    spy.mockReturnValue({
      user: verifiedUser,
    });
  });

  it('component is defined', async () => {
    const history = createMemoryHistory();

    await act(async () => {
      mount(
        <Router history={history}>
          <MockedProvider cache={cacheAccountWithCharity}>
            <UserAccountProvider {...props} />
          </MockedProvider>
        </Router>,
      );
    });

    expect(window.location.href).toEqual('stripeLink');
  });

  describe('execute MyAccount query with phone number required status', () => {
    it('should redirect to phone number page', async () => {
      const history = createMemoryHistory();

      await act(async () => {
        mount(
          <Router history={history}>
            <MockedProvider cache={cacheAccountConfirmNumber}>
              <UserAccountProvider {...props} />
            </MockedProvider>
          </Router>,
        );
      });

      expect(history.location.pathname).toEqual('/phone-verification');
    });
  });

  describe('execute MyAccount query with phone number confirmation status', () => {
    it('should redirect to phone number confirmation page', async () => {
      const history = createMemoryHistory();

      await act(async () => {
        mount(
          <Router history={history}>
            <MockedProvider cache={cacheAccountNumberRequired}>
              <UserAccountProvider {...props} />
            </MockedProvider>
          </Router>,
        );
      });

      expect(history.location.pathname).toEqual('/phone-confirmation');
    });
  });

  describe('execute MyAccount query with influencer entity without description', () => {
    it('should redirect to influencer onboarding page', async () => {
      const history = createMemoryHistory();

      await act(async () => {
        mount(
          <Router history={history}>
            <MockedProvider cache={cacheAccountInfluencerWithoutDescription}>
              <UserAccountProvider {...props} />
            </MockedProvider>
          </Router>,
        );
      });

      expect(history.location.pathname).toEqual('/onboarding/basic');
    });
  });
});
