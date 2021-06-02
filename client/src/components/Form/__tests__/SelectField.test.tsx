import { render } from '@testing-library/react';

import SelectField from '../SelectField';
import Form from 'src/components/Form/Form';

const mockedSumbit = jest.fn();
const props = {
  name: 'test',
  options: [],
};
test('renders without crashing', () => {
  render(
    <Form onSubmit={mockedSumbit}>
      <SelectField {...props} />
    </Form>,
  );
});
