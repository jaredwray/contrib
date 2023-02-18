import React from 'react';
import Select from '..';
import { mount, ReactWrapper } from 'enzyme';
import { DropdownButton } from 'react-bootstrap';
import { act } from '@testing-library/react';

describe('Should render correctly "Select"', () => {
  let e: React.SyntheticEvent;

  const props: any = {
    options: ['1', '2', '3'],
    onChange: jest.fn(),
    selected: 'test',
    placeholder: 'test',
  };

  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(<Select {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('component should return null', () => {
    wrapper.setProps({ ...props, options: null });
    expect(wrapper.find('DropdownButton')).toHaveLength(0);
  });
  it('component has options as array of objects', () => {
    wrapper.setProps({
      ...props,
      options: [
        { value: '1', label: 'test1' },
        { value: '2', label: 'test2' },
      ],
    });
    expect(wrapper.find('DropdownButton')).toHaveLength(1);
    act(() => {
      wrapper.find(DropdownButton).prop('onSelect')!('1', e);
    });
  });
});
