import { mount, ReactWrapper } from 'enzyme';
import MoneyField from 'src/components/Form/MoneyField';
import Form from 'src/components/Form/Form';

jest.mock('src/components/Form/hooks/useField', () => () => {
  return {
    name: 'bid',
    hasError: false,
    checked: undefined,
    disabled: false,
    errorMessage: null,
    onBlur: jest.fn(),
    onChange: jest.fn(),
    onFocus: jest.fn(),
    value: { amount: 2000, currency: 'USD', precision: 2 },
  };
});
describe('Should render correctly "MoneyField"', () => {
  const props: any = {
    name: 'test',
    minValue: 1,
    setDisabled: jest.fn(),
  };
  const mockFn = jest.fn();

  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <Form onSubmit={mockFn}>
        <MoneyField {...props} />
      </Form>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('component is defined', () => {
    wrapper.find('input').simulate('change', { target: { value: '$100' } });
    expect(props.setDisabled).toHaveBeenCalledTimes(1);
  });
});
