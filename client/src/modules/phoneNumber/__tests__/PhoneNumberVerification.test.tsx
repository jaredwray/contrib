import { mount, ReactWrapper } from 'enzyme';

import * as ApolloClient from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { Auth0Provider } from '@auth0/auth0-react';
import { act } from 'react-dom/test-utils';
import { FormApi } from 'final-form';
import { Form } from 'react-final-form';

import PhoneInput from 'src/components/forms/inputs/PhoneInput';
import { EnterPhoneNumberMutation, EnterInvitationCodeMutation } from 'src/apollo/queries/phoneNumberVerification';
import { MyAccountQuery } from 'src/apollo/queries/accountQuery';
import { UserAccountStatus } from 'src/types/UserAccount';

import PhoneNumberVerification from '../Verification';
import Layout from '../Layout';

const cache = new ApolloClient.InMemoryCache();

cache.writeQuery({
  query: MyAccountQuery,
  data: {
    myAccount: {
      id: '123',
      phoneNumber: '123',
      status: UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED,
      influencerProfile: null,
      isAdmin: false,
      createdAt: '2021-02-18T14:36:35.208+00:00',
      notAcceptedTerms: null,
      assistant: null,
      paymentInformation: null,
      charity: null,
      mongodbId: '321',
      address: {
        name: 'test name',
        state: 'test state',
        city: 'test city',
        zipCode: 'test zipCode',
        country: 'test country',
        street: 'test street',
      },
    },
  },
});

const mockFn = jest.fn();
const mockHistoryReplace = jest.fn();
const mockLogout = jest.fn();

const mocks = [
  {
    request: {
      query: EnterPhoneNumberMutation,
      variables: { phoneNumber: '3222222222' },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          createAccountWithPhoneNumber: {
            id: 'testID',
            phoneNumber: '2323232323',
            status: 'testStatus',
          },
        },
      };
    },
  },
  {
    request: {
      query: EnterInvitationCodeMutation,
      variables: { code: '2222' },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          createAccountWithInvitation: {
            id: 'testID',
            phoneNumber: '3222222222',
            status: 'testStatus',
          },
        },
      };
    },
  },
];

jest.mock('@auth0/auth0-react', () => ({
  Auth0Provider: (props: any) => props.children,
  withAuthenticationRequired: (component: any, _: any) => component,
  useAuth0: () => {
    return {
      isLoading: false,
      user: { sub: 'foobar' },
      isAuthenticated: true,
      loginWithRedirect: jest.fn(),
      logout: mockLogout,
    };
  },
}));

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as object),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));

describe('PhoneNumberVerification page ', () => {
  it('component is defined and has Layout', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MockedProvider cache={cache}>
          <PhoneNumberVerification />
        </MockedProvider>,
      );
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(wrapper!).toHaveLength(1);
    expect(wrapper!.find(Layout)).toHaveLength(1);
  });

  describe('Logout after click on Back button', () => {
    it('logout', async () => {
      let wrapper: ReactWrapper;

      await act(async () => {
        wrapper = mount(
          <Auth0Provider
            audience={'test'}
            cacheLocation="localstorage"
            clientId={'test'}
            domain={'test'}
            redirectUri={'test'}
            onRedirectCallback={jest.fn()}
          >
            <MockedProvider cache={cache}>
              <PhoneNumberVerification />
            </MockedProvider>
            ,
          </Auth0Provider>,
        );
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });

      act(() => {
        wrapper.find("[data-test-id='back_btn']").simulate('click');
      });

      wrapper!.update();

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });
  describe('Submit Form with phoneNumber is defined', () => {
    it('mutation EnterPhoneNumber was called', async () => {
      let wrapper: ReactWrapper;
      let FormParams: FormApi<unknown, unknown>;

      await act(async () => {
        wrapper = mount(
          <MockedProvider cache={cache} mocks={mocks}>
            <PhoneNumberVerification />
          </MockedProvider>,
        );
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });

      act(() => {
        wrapper!
          .find(PhoneInput)
          .props()
          .onChange('12222222', { name: 'United States', countryCode: '2', dialCode: '2', format: '2' });
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });

      act(() => {
        wrapper!
          .find(Form)
          .props()
          .onSubmit({}, FormParams, () => {});
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });

      expect(mockFn).toHaveBeenCalledTimes(0);
    });
  });

  describe('Submit Form with invitationToken is defined', () => {
    it('mutation EnterInvitationCode was called', async () => {
      jest.spyOn(ApolloClient, 'useReactiveVar').mockReturnValue('222');

      let wrapper: ReactWrapper;

      await act(async () => {
        wrapper = mount(
          <MockedProvider cache={cache} mocks={mocks}>
            <PhoneNumberVerification />
          </MockedProvider>,
        );
      });

      expect(mockFn).toHaveBeenCalledTimes(0);
    });
  });
});
