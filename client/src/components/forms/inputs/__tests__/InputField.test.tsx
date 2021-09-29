import { mount, ReactWrapper } from 'enzyme';

import { Form as BForm } from 'react-bootstrap';

import InputField from '../InputField';
import Form from 'src/components/forms/Form/Form';

const { Control } = BForm;
const mockedSumbit = jest.fn();

describe('Should render correctly "Form"', () => {
  const props = {
    name: 'test',
    onInput: jest.fn(),
  };

  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <Form onSubmit={mockedSumbit}>
        <InputField {...props} />
      </Form>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
    wrapper.find(Control).prop('onInput')('test');
    expect(props.onInput).toBeCalled();
  });
});
