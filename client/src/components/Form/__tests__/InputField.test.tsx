import { render } from '@testing-library/react';

import InputField from '../InputField';
import Form from 'src/components/Form/Form';

const mockedSumbit = jest.fn();
const props = {
  name: 'test',
};
test('renders without crashing', () => {
  render(
    <Form onSubmit={mockedSumbit}>
      <InputField {...props} />
    </Form>,
  );
});
