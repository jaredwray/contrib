import { act } from 'react-dom/test-utils';
import { ReactWrapper, mount } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import { Button } from 'react-bootstrap';

import Modal from '../Modal';
import ProfileInformation from '../index';

describe('ProfileInformation', () => {
  const mockedSetShowDialog = jest.fn();

  const props: any = {
    currentPhoneNumber: '+22222222222',
    setShowDialog: mockedSetShowDialog,
  };

  let wrapper: ReactWrapper;

  beforeEach(async () => {
    await act(async () => {
      wrapper = mount(
        <MockedProvider>
          <ProfileInformation {...props} />
        </MockedProvider>,
      );
    });
  });

  it('component is defined', async () => {
    expect(wrapper!).toHaveLength(1);
  });

  describe('after click in Change Number Button', () => {
    test('should open Modal window', () => {
      act(() => {
        wrapper.find(Button).first().simulate('click');
        wrapper.update();
      });
      expect(Modal).toBeDefined();
    });
  });

  describe('after call Modal prop setPhoneNumber', () => {
    test('phoneNumber should be updated', () => {
      act(() => {
        wrapper.find(Modal).props().setPhoneNumber('22222');
        wrapper.update();
      });
      expect(Modal).toBeDefined();
    });
  });

  describe('after call Modal prop setCloseDialog', () => {
    test('should close Modal', () => {
      act(() => {
        wrapper.find(Modal).props().setCloseDialog();
        wrapper.update();
      });
      expect(wrapper).toBeDefined();
    });
  });
});
