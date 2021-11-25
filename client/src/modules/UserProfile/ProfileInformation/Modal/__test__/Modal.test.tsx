import { mount, ReactWrapper } from 'enzyme';
import { SyntheticEvent } from 'react';

import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { act } from 'react-dom/test-utils';

import Dialog from 'src/components/modals/Dialog';
import VerificationStep from '../Verification';
import ConfirmationStep from '../Confirmation';

import Modal from '..';

const mockFn = jest.fn();

const props = {
  currentPhoneNumber: '33333',
  showDialog: true,
  setCloseDialog: mockFn,
  setPhoneNumber: mockFn,
};

describe('Modal', () => {
  let wrapper: ReactWrapper;

  beforeEach(async () => {
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <Modal {...props} />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
  });

  it('component is defined ', async () => {
    expect(wrapper!.children().find(Dialog)).toBeDefined();
  });

  describe('after function call "onClose"', () => {
    it('component has closed ', async () => {
      let event: SyntheticEvent;

      act(() => {
        wrapper!.children().find(Dialog).props().onClose(event);
      });

      wrapper.update();

      expect(wrapper!.children().find(Dialog).getDOMNode()).toEqual([null, null]);
    });
  });

  describe('after function call "setVerified"', () => {
    it('component state "verified" should have changed ', async () => {
      act(() => {
        wrapper!.children().find(VerificationStep).props().setVerified();
      });

      wrapper.update();

      expect(wrapper!.children().find(ConfirmationStep)).toBeDefined();
    });
  });

  describe('after function call "setNewPhoneNumber"', () => {
    it('component state "newPhoneNumber" should have changed ', async () => {
      act(() => {
        wrapper!.children().find(VerificationStep).props().setNewPhoneNumber('222');
      });

      wrapper.update();

      expect(wrapper!.children().find(VerificationStep).props().newPhoneNumber).toEqual('222');
    });
  });

  describe('after function call "setPhoneNumber"', () => {
    it('component prop "currentPhoneNumber" should have changed ', async () => {
      act(() => {
        wrapper!.children().find(VerificationStep).props().setVerified();
      });

      wrapper.update();

      act(() => {
        wrapper!.children().find(ConfirmationStep).props().setPhoneNumber('33333');
      });

      wrapper.update();

      expect(wrapper!.find(Modal).props().currentPhoneNumber).toEqual('33333');
    });
  });
});
