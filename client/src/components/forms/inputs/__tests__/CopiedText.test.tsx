import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';

import CopiedText from '../CopiedText';

describe('CopiedText', () => {
  document.execCommand = jest.fn();

  it('component is defined and has Layout', async () => {
    let wrapper: ReactWrapper;
    window.prompt = () => {};
    await act(async () => {
      wrapper = mount(<CopiedText text="text" />);
    });
    expect(wrapper!).toHaveLength(1);
    wrapper!.find('Button').first().simulate('click');
    wrapper!.find('CopyToClipboard').children().find('Button').simulate('click');
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });
});
