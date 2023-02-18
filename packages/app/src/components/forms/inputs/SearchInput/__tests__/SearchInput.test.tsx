import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';

import SearchInput from '..';

describe('SearchInput', () => {
  const props = {
    onChange: jest.fn(),
    onCancel: jest.fn(),
    onClick: jest.fn(),
    disabled: false,
    placeholder: 'test',
    className: 'test',
  };

  it('renders without crashing', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(<SearchInput {...props} />);
    });
    expect(wrapper!).toHaveLength(1);
  });
});
