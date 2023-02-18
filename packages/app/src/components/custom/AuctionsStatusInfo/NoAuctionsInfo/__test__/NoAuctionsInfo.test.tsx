import { shallow, ShallowWrapper } from 'enzyme';

import { NoAuctionsInfo } from '../index';

describe('NoAuctionsInfo', () => {
  let wrapper: ShallowWrapper;

  wrapper = shallow(<NoAuctionsInfo name="testName" />);

  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
