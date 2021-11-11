import { mount, ReactWrapper } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { act } from 'react-dom/test-utils';
import { Form } from 'react-final-form';
import { FormApi } from 'final-form';

import { VerifyChangePhoneNumberMutation } from 'src/apollo/queries/userProfile';
import PhoneInput from 'src/components/forms/inputs/PhoneInput';

import Verification from '../Verification';

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
];

const props = {
  newPhoneNumber: '22222',
  currentPhoneNumber: '33333',
  setNewPhoneNumber: mockFn,
  setVerified: mockFn,
};

describe('Verification', () => {
  let wrapper: ReactWrapper;

  beforeEach(async () => {
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider mocks={mocks}>
              <Verification {...props} />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
  });

  it('component is defined ', async () => {
    expect(wrapper!).toHaveLength(1);
  });

  describe('after function call "onSubmit"', () => {
    it('onSubmit check', async () => {
      let FormParams: FormApi<unknown, unknown>;

      act(() => {
        wrapper!
          .find(Form)
          .props()
          .onSubmit({ value: '33333' }, FormParams, () => {});
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });

      expect(mockFn).toHaveBeenCalledTimes(0);
    });
  });

  describe('after function call "onChange"', () => {
    it('onChange check ', async () => {
      act(() => {
        wrapper!
          .find(PhoneInput)
          .children()
          .find('input')
          .simulate('change', { target: { value: '33333' } });
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();
      });

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
