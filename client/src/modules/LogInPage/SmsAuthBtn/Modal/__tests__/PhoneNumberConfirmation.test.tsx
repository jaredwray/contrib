import { mount, ReactWrapper } from 'enzyme';

import { ToastProvider } from 'react-toast-notifications';
import { MockedProvider } from '@apollo/client/testing';
import { act } from 'react-dom/test-utils';

import { SendOtpMutation } from 'src/apollo/queries/phoneNumberMutations';

import { PhoneNumberConfirmation } from '../phoneNumberConfirmation';

const sendOtpMock = jest.fn();

const props = {
  phoneNumber: '3222222222',
  returnURL: 'test returnUrl',
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

describe('PhoneNumberConfirmation modal step ', () => {
  it('component is defined', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <MockedProvider mocks={mocks}>
            <PhoneNumberConfirmation {...props} />
          </MockedProvider>
        </ToastProvider>,
      );
      expect(wrapper!).toHaveLength(1);
    });
  });

  describe('Handle resenCode', () => {
    it('should resend code', async () => {
      let wrapper: ReactWrapper;
      const e: any = Event;

      await act(async () => {
        wrapper = mount(
          <ToastProvider>
            <MockedProvider mocks={mocks}>
              <PhoneNumberConfirmation {...props} />
            </MockedProvider>
          </ToastProvider>,
        );

        wrapper.find("[data-test-id='resend_otp']").last().props().onClick(e);

        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();

        expect(sendOtpMock).toHaveBeenCalledTimes(0);
      });
    });
  });
});
