import { mount, ReactWrapper } from 'enzyme';

import CoverImage from 'src/components/custom/CoverImage';

describe('Should render correctly "CoverImage"', () => {
  const props: any = {
    src: 'test',
    alt: 'test',
    formatSize: 420,
  };

  let wrapper: ReactWrapper;
  
  beforeEach(() => {
    wrapper = mount(<CoverImage {...props} />);
  });

  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });

  describe('call onError prop on img', () => {
    it('should change src value to default', () => {
      const mEvent = { target: wrapper.getDOMNode() } as any;
      wrapper.find('img').prop('onError')!(mEvent);
      expect((wrapper.getDOMNode() as HTMLImageElement).src).toBe('/content/img/default-auction-preview.webp');
    });
  });
});
