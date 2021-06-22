import { shallow, ShallowWrapper } from 'enzyme';
import MoneyField from 'src/components/Form/MoneyField';
import Form from 'src/components/Form/Form';

describe('Should render correctly "MoneyField"', () => {
  const props: any = {
    name: 'test',
  };
  const mockFn = jest.fn();

  let wrapper: ShallowWrapper;
  beforeEach(() => {
    wrapper = shallow(
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
});
