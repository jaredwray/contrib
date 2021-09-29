import Dinero from 'dinero.js';
import { ReactWrapper, mount } from 'enzyme';

import { BidInput } from '../BidInput';
import Form from 'src/components/forms/Form/Form';

describe('Should render correctly "BidInput"', () => {
  const props: any = {
    minBid: Dinero({ amount: 1, currency: 'USD' }),
    onSubmit: jest.fn(),
    fairMarketValue: Dinero({ amount: 3, currency: 'USD' }),
  };

  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(<BidInput {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('should scall onSubmit when submitting', () => {
    wrapper.find(Form).props().onSubmit({ amount: 3, currency: 'USD' });
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });
});
