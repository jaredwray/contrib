import { shallow, ShallowWrapper } from 'enzyme';

import { AuctionsInfoLoading } from '../index';

describe('AuctionsInfoLoading', () => {
  let wrapper: ShallowWrapper;

  wrapper = shallow(<AuctionsInfoLoading name="testName" />);

  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
