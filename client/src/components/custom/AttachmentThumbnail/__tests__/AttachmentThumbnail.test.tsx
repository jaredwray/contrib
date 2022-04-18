import { act } from '@testing-library/react';
import { mount } from 'enzyme';
import { Image } from 'react-bootstrap';

import AddVideoIcon from 'src/assets/icons/VideoIcon';
import AddPhotoIcon from 'src/assets/images/PhotoIcon';
import AttachmentThumbnail from '..';

const error: any = new Error();

describe('AttachmentThumbnail', () => {
  describe('with VIDEO type', () => {
    const props: any = {
      attachment: { thumbnail: 'test', type: 'VIDEO', url: 'test' },
      className: 'test',
    };
    it('renders component', () => {
      const wrapper = mount(<AttachmentThumbnail {...props} />);
      expect(wrapper).toHaveLength(1);
    });

    describe('when cannot render a video', () => {
      it('rednders default icoon', () => {
        const wrapper = mount(<AttachmentThumbnail {...props} />);
        act(() => {
          wrapper.find(Image).prop('onError')!(error);
        });
        wrapper.update();
        expect(wrapper).toHaveLength(1);
        expect(wrapper.find(AddVideoIcon)).toHaveLength(1);
      });
    });
  });

  describe('with IMAGE type', () => {
    const props: any = {
      attachment: { thumbnail: 'test', type: 'IMAGE', url: 'test' },
      className: 'test',
    };

    it('renders component', () => {
      const wrapper = mount(<AttachmentThumbnail {...props} />);
      expect(wrapper).toHaveLength(1);
    });

    describe('when cannot render an image', () => {
      it('rednders default icoon', () => {
        const wrapper = mount(<AttachmentThumbnail {...props} />);
        act(() => {
          wrapper.find(Image).prop('onError')!(error);
        });
        wrapper.update();
        expect(wrapper).toHaveLength(1);
        expect(wrapper.find(AddPhotoIcon)).toHaveLength(1);
      });
    });
  });
});
