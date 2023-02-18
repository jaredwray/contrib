import { mount, ReactWrapper } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { act } from 'react-dom/test-utils';

import Dialog from 'src/components/modals/Dialog';
import ProfileInformation from '../ProfileInformation';
import Modal from '../ProfileInformation/Modal';

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

  describe('after function call "setCloseDialog"', () => {
    it('component Modal has closed ', async () => {
      act(() => {
        wrapper!.children().find(Modal).props().setCloseDialog();
      });

      wrapper.update();

      expect(wrapper!.children().find(Dialog).getDOMNode()).toEqual(null);
    });
  });
});
