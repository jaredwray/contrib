import { mount, ReactWrapper } from 'enzyme';

import { ToastProvider } from 'react-toast-notifications';
import { MockedProvider } from '@apollo/client/testing';
import { act } from 'react-dom/test-utils';

import { SendOtpMutation } from 'src/apollo/queries/phoneNumberMutations';

import { PhoneNumberConfirmation } from '../phoneNumberConfirmation';

const sendOtpMock = jest.fn();

const props = {
  phoneNumber: '16898373700',
  returnURL: 'testReturnUrl',
};

const mocks = [
  {
    request: {
      query: SendOtpMutation,
      variables: { phoneNumber: '16898373700' },
    },
    newData: () => {
      sendOtpMock();
      return {
        data: {
          sendOtp: {
            phoneNumber: '16898373700',
          },
        },
      };
    },
  },
];

describe('PhoneNumberConfirmation modal step ', () => {
  let wrapper: ReactWrapper;

  beforeEach(async () => {
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <MockedProvider mocks={mocks}>
            <PhoneNumberConfirmation {...props} />
          </MockedProvider>
        </ToastProvider>,
      );
    });
  });

  it('component is defined', async () => {
    expect(wrapper!).toHaveLength(1);
  });

  describe('Handle resenCode', () => {
    it('should not resend code', async () => {
      const e: any = Event;

      await act(async () => {
        wrapper!.find("[data-test-id='resend_otp']").last().props().onClick(e);

        await new Promise((resolve) => setTimeout(resolve));
        wrapper!.update();

        expect(sendOtpMock).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('change otp value', () => {
    it('should set otp is valid', async () => {
      await act(async () => {
        wrapper!.find('input').simulate('change', { target: { value: '222222' } });

        await new Promise((resolve) => setTimeout(resolve));
        wrapper!.update();
      });
      const buttonDisabledValue = wrapper.find('button').first().prop('disabled');
      
      expect(buttonDisabledValue).toEqual(false);
    });

    it('should set otp is invalid', async () => {
      await act(async () => {
        wrapper!.find('input').simulate('change', { target: { value: '222222' } });

        await new Promise((resolve) => setTimeout(resolve));
        wrapper!.update();

        wrapper!.find('input').simulate('change', { target: { value: '22222' } });

        await new Promise((resolve) => setTimeout(resolve));
        wrapper!.update();
      });
      const buttonDisabledValue = wrapper.find('button').first().prop('disabled');

      expect(buttonDisabledValue).toEqual(true);
    });
  });

  describe('submit form', () => {
    process.env = { ...process.env, REACT_APP_PLATFORM_URL: 'https://dev.contrib.org' };

    delete window.location;
    window.location = { ...window.location, href: 'test' };

    global.fetch = () =>
      Promise.resolve({
        json: () => Promise.resolve({ country: 'BY' }),
      });

    it('should redirect to testReturnUrl', async () => {
      await act(async () => {
        wrapper!.find('form').props().onSubmit();

        await new Promise((resolve) => setTimeout(resolve));
        wrapper!.update();
      });
      expect(window.location.href).toEqual('https://dev.contrib.org/after-login?returnURL=testReturnUrl');
    });
  });
});
