import React, { useRef, useEffect, useCallback, useState } from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';

import useOutsideClick from '../useOutsideClick';

describe('timeFormatters', () => {
  const callback = jest.fn();
  const map = {};
  let wrapper;

  const Test = () => {
    const ref = useRef();
    const [refDefined, setRefDefined] = useState(false);

    useOutsideClick(ref, callback);

    useEffect(() => {
      setRefDefined(true);
    });

    return (
      <>
        <h1 ref={ref}>element 1</h1>
        <span>element 2</span>
      </>
    );
  };

  beforeEach(() => {
    document.addEventListener = jest.fn((e, cb) => {
      map[e] = cb;
    });
    wrapper = mount(<Test />);
  });

  it('does not call callback if the click was inside of passed ref', async () => {
    wrapper.find('h1').simulate('click');
    expect(callback).not.toBeCalled();
  });

  it('calls callback if the click was inside of passed ref', async () => {
    map.click({ target: wrapper.find('span').getDOMNode() });
    expect(callback).toBeCalled();
  });
});
