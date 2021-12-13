import { mount, ReactWrapper } from 'enzyme';

import { MockedProvider } from '@apollo/client/testing';
import * as ApolloClient from '@apollo/client';
import { act } from 'react-dom/test-utils';
import { Form } from 'react-final-form';
import { Button } from 'react-bootstrap';
import { FormApi } from 'final-form';

import {
  ConfirmPhoneNumberMutation,
  ConfirmPhoneNumberWithInvitationMutation,
  ResendOtpMutation,
  ResendOtpWithInvitationMutation,
} from 'src/apollo/queries/phoneNumberMutations';
import { MyAccountQuery } from 'src/apollo/queries/accountQuery';
import { UserAccountStatus } from 'src/types/UserAccount';
import * as auth from 'src/helpers/useAuth';

import PhoneNumberConfirmation from '../Confirmation';
import Layout from '../Layout';

const mockHistoryPush = jest.fn();
const mockLogout = jest.fn();
const mockFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const cache = new ApolloClient.InMemoryCache();

cache.writeQuery({
  query: MyAccountQuery,
  data: {
    myAccount: {
      id: '123',
      phoneNumber: '2222222222',
      status: UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED,
      influencerProfile: null,
      isAdmin: false,
      createdAt: '2021-02-18T14:36:35.208+00:00',
      notAcceptedTerms: null,
      assistant: null,
      paymentInformation: null,
      mongodbId: '321',
      charity: null,
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

const mocks = [
  {
    request: {
      query: ConfirmPhoneNumberWithInvitationMutation,
      variables: { code: '3222222222', otp: '4444' },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          confirmAccountWithInvitation: {
            id: 'testID',
            phoneNumber: '2323232323',
            status: 'testStatus',
            influencerProfile: {
              id: 'testId',
            },
          },
        },
      };
    },
  },
  {
    request: {
      query: ConfirmPhoneNumberMutation,
      variables: { phoneNumber: '3222222222', otp: '4444' },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          confirmAccountWithPhoneNumber: {
            id: 'testID',
            phoneNumber: '3222222222',
            status: 'testStatus',
            influencerProfile: {
              id: 'testInfId',
            },
          },
        },
      };
    },
  },
  {
    request: {
      query: ResendOtpMutation,
      variables: { phoneNumber: '3222222222' },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          createAccountWithPhoneNumber: {
            id: 'testID',
            phoneNumber: '3222222222',
            status: 'testStatus',
            influencerProfile: {
              id: 'testInfId',
            },
          },
        },
      };
    },
  },
  {
    request: {
      query: ResendOtpWithInvitationMutation,
      variables: { code: '4444' },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          createAccountWithInvitation: {
            id: 'testID',
            phoneNumber: '3222222222',
            status: 'testStatus',
            influencerProfile: {
              id: 'testInfId',
            },
          },
        },
      };
    },
  },
];

describe('PhoneNumberConfirmation page ', () => {
  beforeEach(() => {
    const spy = jest.spyOn(auth, 'useAuth');
    spy.mockReturnValue({
      logout: () => mockLogout(),
    });
  });

  it('component return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MockedProvider>
          <PhoneNumberConfirmation />
        </MockedProvider>,
      );
    });
    expect(wrapper!.find(Layout)).toHaveLength(0);
  });

  it('component is defined and has Layout', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MockedProvider cache={cache}>
          <PhoneNumberConfirmation />
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
          <MockedProvider cache={cache}>
            <PhoneNumberConfirmation />
          </MockedProvider>,
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

  describe('Submit Form without otp', () => {
    it('no one mutation was not called', async () => {
      let wrapper: ReactWrapper;
      let FormParams: FormApi<unknown, unknown>;

      await act(async () => {
        wrapper = mount(
          <MockedProvider cache={cache} mocks={mocks}>
            <PhoneNumberConfirmation />
          </MockedProvider>,
        );
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });

      act(() => {
        wrapper!
          .find(Form)
          .props()
          .onSubmit({ otp: '' }, FormParams, () => {});
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });

      expect(mockFn).toHaveBeenCalledTimes(0);
    });
  });

  describe('Submit Form with otp and phoneNumber is defined', () => {
    it('mutation confirmPhoneNumber was called', async () => {
      let wrapper: ReactWrapper;
      let FormParams: FormApi<unknown, unknown>;

      await act(async () => {
        wrapper = mount(
          <MockedProvider cache={cache} mocks={mocks}>
            <PhoneNumberConfirmation />
          </MockedProvider>,
        );
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });

      act(() => {
        wrapper!
          .find(Form)
          .props()
          .onSubmit({ otp: '4444' }, FormParams, () => {});
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });

      expect(mockFn).toHaveBeenCalledTimes(0);
    });
  });

  describe('Submit Form with otp and invitationToken is defined', () => {
    it('mutation confirmPhoneNumberWithInvitation was called', async () => {
      jest.spyOn(ApolloClient, 'useReactiveVar').mockReturnValue('222');

      let wrapper: ReactWrapper;
      let FormParams: FormApi<unknown, unknown>;

      await act(async () => {
        wrapper = mount(
          <MockedProvider cache={cache} mocks={mocks}>
            <PhoneNumberConfirmation />
          </MockedProvider>,
        );
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });

      act(() => {
        wrapper!
          .find(Form)
          .props()
          .onSubmit({ otp: '4444' }, FormParams, () => {});
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });

      expect(mockFn).toHaveBeenCalledTimes(0);
    });
  });

  describe('Click on Resend Code button with invitationToken defined', () => {
    it('mutation createAccountWithInvitation was called', async () => {
      jest.spyOn(ApolloClient, 'useReactiveVar').mockReturnValue('222');

      let wrapper: ReactWrapper;

      await act(async () => {
        wrapper = mount(
          <MockedProvider cache={cache} mocks={mocks}>
            <PhoneNumberConfirmation />
          </MockedProvider>,
        );
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });

      act(() => {
        wrapper!.find(Button).last().simulate('click');
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });

      expect(mockFn).toHaveBeenCalledTimes(0);
    });
  });

  describe('Click on Resend Code button with phoneNumber defined', () => {
    it('mutation createAccountWithPhoneNumber was called', async () => {
      let wrapper: ReactWrapper;

      await act(async () => {
        wrapper = mount(
          <MockedProvider cache={cache} mocks={mocks}>
            <PhoneNumberConfirmation />
          </MockedProvider>,
        );
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });

      act(() => {
        wrapper!.find(Button).last().simulate('click');
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });

      expect(mockFn).toHaveBeenCalledTimes(0);
    });
  });
});
