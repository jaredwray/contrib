import { mount, ReactWrapper } from 'enzyme';

import { act } from 'react-dom/test-utils';
import { Button } from 'react-bootstrap';

import { QRCodeModal } from '../Modal';

import ShareBtn from '..';

const props: any = {
  link: 'link',
};

describe('Should render "ShareBtn" correctly', () => {
  let wrapper: ReactWrapper;

  beforeEach(async () => {
    await act(async () => {
      wrapper = mount(<ShareBtn {...props} />);
    });
  });

  it('renders without crashing', () => {
    expect(wrapper).toBeDefined();
  });

  describe('Click on Share button', () => {
    it('Should open modal with QR code', async () => {
      await act(async () => {
        wrapper.find(Button).simulate('click');

        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();

        expect(QRCodeModal).toBeDefined();
      });
    });
  });

  describe('Click on close button in QR code modal', () => {
    it('Should close modal with QR code', async () => {
      await act(async () => {
        wrapper.find(QRCodeModal).props().onClose();

        await new Promise((resolve) => setTimeout(resolve));
        wrapper.update();

        expect(wrapper.find(QRCodeModal)).toEqual({});
      });
    });
  });
});
