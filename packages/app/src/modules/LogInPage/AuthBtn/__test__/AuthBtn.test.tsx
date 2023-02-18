import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Button } from 'react-bootstrap';
import { ToastProvider } from 'react-toast-notifications';

import * as auth from 'src/helpers/useAuth';

import AuthBtn from '..';

const withoutReturnQuery = {
  provider: 'google',
  returnQuery: '',
};

const googleProps = {
  provider: 'google',
  returnQuery: '/returnURL',
};

const smsProps = {
  provider: 'sms',
  text: 'text',
  returnQuery: '/returnURL',
};

const mockRedirect = jest.fn();

describe('AuthBtn', () => {
  it('component defined', async () => {
    let wrapper: ReactWrapper;

    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <MockedProvider>
            <AuthBtn {...withoutReturnQuery} />
          </MockedProvider>
        </ToastProvider>,
      );
    });
    expect(wrapper!.find(AuthBtn)).toHaveLength(1);
  });

  describe('Click on auth button with google provider', () => {
    it('should call redirect function', async () => {
      const spy = jest.spyOn(auth, 'useAuth');
      spy.mockReturnValue({
        loginWithRedirect: (values) => mockRedirect(),
      });

      let wrapper: ReactWrapper;

      await act(async () => {
        wrapper = mount(
          <ToastProvider>
            <MockedProvider>
              <AuthBtn {...googleProps} />
            </MockedProvider>
          </ToastProvider>,
        );
      });
      const buttonsWrapper = wrapper!.find("[data-test-id='log_in']").simulate('click');
      const googleButton = wrapper!.find(Button).last();
      expect(googleButton.text()).toEqual('Log In With Google');

      buttonsWrapper.simulate('click');

      expect(mockRedirect).toHaveBeenCalled();
    });
  });

  describe('Click on auth button with sms provider', () => {
    it('should not call redirect function', async () => {
      const spy = jest.spyOn(auth, 'useAuth');
      spy.mockReturnValue({
        loginWithRedirect: (values) => mockRedirect(),
      });

      let wrapper: ReactWrapper;

      await act(async () => {
        wrapper = mount(
          <ToastProvider>
            <MockedProvider>
              <AuthBtn {...smsProps} />
            </MockedProvider>
          </ToastProvider>,
        );
      });
      const buttonsWrapper = wrapper!.find("[data-test-id='log_in']").simulate('click');
      const googleButton = wrapper!.find(Button).last();
      expect(googleButton.text()).toEqual('Log In With text');

      buttonsWrapper.simulate('click');

      expect(mockRedirect).toHaveBeenCalledTimes(0);
    });
  });
});
