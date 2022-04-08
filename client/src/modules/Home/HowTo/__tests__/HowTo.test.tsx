import { mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';

import HowTo from '..';
import Item from '../Item';

describe('HowTo', () => {
  it('renders the component', () => {
    const wrapper = mount(
      <BrowserRouter>
        <HowTo />
      </BrowserRouter>,
    );
    expect(wrapper!).toHaveLength(1);
    expect(wrapper!.find(Item)).toHaveLength(3);
  });
});
