import { mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';

import Item from '../Item';

describe('Item', () => {
  describe('without withSeparator', () => {
    it('renders component', () => {
      const wrapper = mount(
        <BrowserRouter>
          <Item icon="icon" text="text" btnText="btnText" />
        </BrowserRouter>,
      );
      expect(wrapper!).toHaveLength(1);
    });
  });
  describe('with withSeparator', () => {
    it('renders component', () => {
      const wrapper = mount(
        <BrowserRouter>
          <Item withSeparator icon="icon" text="text" btnText="btnText" />
        </BrowserRouter>,
      );
      expect(wrapper!).toHaveLength(1);
    });
  });
});
