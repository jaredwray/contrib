import { mount, ReactWrapper } from 'enzyme';

import { ToastProvider } from 'react-toast-notifications';
import { MockedProvider } from '@apollo/client/testing';
import { act } from 'react-dom/test-utils';

import Dialog from 'src/components/modals/Dialog';

import { Modal } from '../';

const onCloseMock = jest.fn();

const props = {
  open: true,
  isConfirmed: true,
  setIsConfirmed: (value: any) => {
    jest.fn();
  },
  onClose: () => {
    onCloseMock();
  },
  returnURL: 'returnUrl',
};

describe('Modal', () => {
  it('component is defined', async () => {
    let wrapper: ReactWrapper;

    const e: any = Event;

    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <MockedProvider>
            <Modal {...props} />
          </MockedProvider>
        </ToastProvider>,
      );
      expect(wrapper!).toHaveLength(1);
    });
  });

  describe('Handle onClose method in Dialog', () => {
    it('should close Modal', async () => {
      let wrapper: ReactWrapper;

      const e: any = Event;

      await act(async () => {
        wrapper = mount(
          <ToastProvider>
            <MockedProvider>
              <Modal {...props} />
            </MockedProvider>
          </ToastProvider>,
        );

        wrapper.find(Dialog).props().onClose(e);

        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();

        expect(onCloseMock).toHaveBeenCalled();
      });
    });
  });
});
