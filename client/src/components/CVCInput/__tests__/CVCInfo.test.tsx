import { ReactWrapper, mount } from 'enzyme';
import CVCInput from 'src/components/CVCInput';
import Form from 'src/components/Form/Form';

import { Form as BsForm } from 'react-bootstrap';

const { Control } = BsForm;

const mockedSumbit = jest.fn();

describe('Should render correctly "CVCInput"', () => {
  const props: any = {
    disabled: false,
    type: 'string',
    name: 'test',
    labelText: 'test',
    maxLength: 2,
    onInput: jest.fn(),
  };

  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <Form onSubmit={mockedSumbit}>
        <CVCInput {...props} />
      </Form>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('should call onInput', () => {
    wrapper.find(Control).simulate('keypress', { key: 'q' });
    wrapper.find(Control).simulate('input', { target: { value: 'q' } });
    expect(props.onInput).toHaveBeenCalledTimes(1);
  });
});
