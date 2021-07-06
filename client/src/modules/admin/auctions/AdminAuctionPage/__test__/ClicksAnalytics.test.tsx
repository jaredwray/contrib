import { shallow, ShallowWrapper } from 'enzyme';

import { auction } from 'src/helpers/testHelpers/auction';
import { bitly } from 'src/helpers/testHelpers/bitly';
import { ClicksAnalytics } from '../ClicksAnalytics';

describe('Should render correctly "ClicksAnalytics"', () => {
  const props: any = { bitly, auction };

  let wrapper: ShallowWrapper;
  beforeEach(() => {
    wrapper = shallow(<ClicksAnalytics {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
