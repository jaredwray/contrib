import { act } from '@testing-library/react';
import { mount, shallow, ShallowWrapper } from 'enzyme';
import { Image } from 'react-bootstrap';

import AttachmentThumbnail from '..';

describe('Should render correctly "AttachmentThumbnail"', () => {
  const props: any = {
    attachment: { thumbnail: 'test', type: 'VIDEO', url: 'test' },
    className: 'test',
  };

  const error: any = new Error();

  beforeEach(() => {});
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    const wrapper = mount(<AttachmentThumbnail {...props} />);
    expect(wrapper).toHaveLength(1);
  });
  it('component is defined and has error preview image', () => {
    const wrapper = mount(<AttachmentThumbnail {...props} />);
    act(() => {
      wrapper.find(Image).prop('onError')!(error);
    });
    expect(wrapper).toHaveLength(1);
  });
});
