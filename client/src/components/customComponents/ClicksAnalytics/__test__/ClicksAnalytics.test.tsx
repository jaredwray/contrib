import { shallow, ShallowWrapper } from 'enzyme';

import { auction } from 'src/helpers/testHelpers/auction';
import { metrics } from 'src/helpers/testHelpers/metrics';
import { ClicksAnalytics } from '../index';

describe('Should render correctly "ClicksAnalytics"', () => {
  const props: any = { metrics, auction };

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
