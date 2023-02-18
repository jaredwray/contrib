import { mount, ReactWrapper } from 'enzyme';

import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';

import { act } from 'react-dom/test-utils';
import { Form } from 'react-final-form';
import { FormApi } from 'final-form';
import PhoneInput from 'react-phone-input-2';

import { SendOtpMutation } from 'src/apollo/queries/phoneNumberMutations';

import { PhoneNumberVerification } from '../phoneNumberVerification';

const sendOtpMock = jest.fn();
const setIsConfirmedMock = jest.fn();
const setPhoneNumberMock = jest.fn();

const props = {
  setIsConfirmed: (value: any) => {
    setIsConfirmedMock();
  },
  setPhoneNumber: (value: any) => {
    setPhoneNumberMock();
  },
};

const propsWithPhoneNumber = {
  phoneNumber: '3222222222',
  ...props,
};

const propsWithoutPhoneNumber = {
  phoneNumber: '',
  ...props,
};

const mocks = [
  {
    request: {
      query: SendOtpMutation,
      variables: { phoneNumber: '3222222222' },
    },
    newData: () => {
      sendOtpMock();
      return {
        data: {
          sendOtp: {
            phoneNumber: '3222222222',
          },
        },
      };
    },
  },
];

describe('PhoneNumberVerification modal step', () => {
  it('component is defined with phone number value', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <MockedProvider mocks={mocks}>
            <PhoneNumberVerification {...propsWithPhoneNumber} />
          </MockedProvider>
        </ToastProvider>,
      );

      expect(wrapper!).toHaveLength(1);
    });
  });

  it('component is defined without phone number value', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <MockedProvider mocks={mocks}>
            <PhoneNumberVerification {...propsWithoutPhoneNumber} />
          </MockedProvider>
        </ToastProvider>,
      );

      expect(wrapper!).toHaveLength(1);
    });
  });

  describe('Handle submit Form', () => {
    it('should send otp', async () => {
      let wrapper: ReactWrapper;
      let FormParams: FormApi<unknown, unknown>;

      await act(async () => {
        wrapper = mount(
          <ToastProvider>
            <MockedProvider mocks={mocks}>
              <PhoneNumberVerification {...propsWithPhoneNumber} />
            </MockedProvider>
          </ToastProvider>,
        );

        wrapper!
          .find(Form)
          .props()
          .onSubmit({}, FormParams, () => {});

        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();

        expect(sendOtpMock).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('Handle change PhoneInput value', () => {
    it('should change phone number value', async () => {
      let wrapper: ReactWrapper;

      await act(async () => {
        wrapper = mount(
          <ToastProvider>
            <MockedProvider mocks={mocks}>
              <PhoneNumberVerification {...propsWithPhoneNumber} />
            </MockedProvider>
          </ToastProvider>,
        );

        wrapper!
          .find(PhoneInput)
          .children()
          .find('input')
          .simulate('change', { target: { value: '33333' } });

        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();

        expect(setPhoneNumberMock).toHaveBeenCalledTimes(2);
      });
    });
  });
});
