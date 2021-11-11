import { mount, ReactWrapper } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { act } from 'react-dom/test-utils';

import Dialog from 'src/components/modals/Dialog';
import ChangePhoneNumber from '../Content/ChangePhoneNumber';
import Modal from '../Modal';

import UserProfile from '..';

describe('UserProfile', () => {
  let wrapper: ReactWrapper;

  beforeEach(async () => {
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <UserProfile />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
  });

  it('component is defined ', async () => {
    expect(wrapper!).toHaveLength(1);
  });

  describe('after function call "setShowDialog"', () => {
    it('component Modal has opened ', async () => {
      act(() => {
        wrapper!.children().find(ChangePhoneNumber).props().setShowDialog();
      });

      wrapper.update();

      expect(wrapper!.children().find(Dialog)).toBeDefined();
    });
  });

  describe('after function call "setCloseDialog"', () => {
    it('component Modal has closed ', async () => {
      act(() => {
        wrapper!.children().find(Modal).props().setCloseDialog();
      });

      wrapper.update();

      expect(wrapper!.children().find(Dialog).getDOMNode()).toEqual(null);
    });
  });

  describe('after function call "setPhoneNumber"', () => {
    it('component state "phoneNumber" has changed ', async () => {
      act(() => {
        wrapper!.children().find(Modal).props().setPhoneNumber('222');
      });

      wrapper.update();

      expect(wrapper!.children().find(ChangePhoneNumber).props().currentPhoneNumber).toEqual('222');
    });
  });
});
