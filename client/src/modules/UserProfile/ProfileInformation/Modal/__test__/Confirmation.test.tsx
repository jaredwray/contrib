import { mount, ReactWrapper } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import { Button as BsButton } from 'react-bootstrap';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { act } from 'react-dom/test-utils';
import { Form } from 'react-final-form';
import { FormApi } from 'final-form';

import { VerifyChangePhoneNumberMutation, ConfirmChangePhoneNumberMutation } from 'src/apollo/queries/userProfile';

import Confirmation from '../Confirmation';

const mockFn = jest.fn();

const mocks = [
  {
    request: {
      query: VerifyChangePhoneNumberMutation,
      variables: { phoneNumber: '3222222222' },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          verifyChangePhoneNumber: {
            phoneNumber: '3222222222',
          },
        },
      };
    },
  },
  {
    request: {
      query: ConfirmChangePhoneNumberMutation,
      variables: { phoneNumber: '3222222222', otp: '4444' },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          confirmChangePhoneNumber: {
            phoneNumber: '3222222222',
          },
        },
      };
    },
  },
];

const props = {
  newPhoneNumber: '22222',
  onClose: () => mockFn,
  setNewPhoneNumber: mockFn,
  setPhoneNumber: mockFn,
  setVerified: mockFn,
};

describe('Confirmation', () => {
  let wrapper: ReactWrapper;

  beforeEach(async () => {
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider mocks={mocks}>
              <Confirmation {...props} />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
  });

  it('component is defined ', async () => {
    expect(wrapper!).toHaveLength(1);
  });

  describe('after click on "Resend code" button', () => {
    it('handle resend code ', async () => {
      act(() => {
        wrapper!.find(BsButton).first().simulate('click');
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });

      expect(mockFn).toHaveBeenCalledTimes(0);
    });
  });

  describe('after function call "onSubmit" with "otp"', () => {
    it('sumbit with "otp"', async () => {
      let FormParams: FormApi<unknown, unknown>;

      act(() => {
        wrapper!
          .find(Form)
          .props()
          .onSubmit({ otp: '2222' }, FormParams, () => {});
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });

      expect(mockFn).toHaveBeenCalledTimes(0);
    });
  });

  describe('after function call "onSubmit" without "otp"', () => {
    it('sumbit without "otp"', async () => {
      let FormParams: FormApi<unknown, unknown>;

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
});
