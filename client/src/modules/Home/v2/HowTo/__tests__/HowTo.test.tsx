import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import HowTo from '..';
import Item from '../Item';

describe('HowTo', () => {
  it('renders the component', () => {
    const wrapper = mount(
      <ToastProvider>
        <MockedProvider>
          <BrowserRouter>
            <HowTo />
          </BrowserRouter>
        </MockedProvider>
      </ToastProvider>,
    );
    expect(wrapper!).toHaveLength(1);
    expect(wrapper!.find(Item)).toHaveLength(3);
  });
});
