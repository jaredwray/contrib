import { render } from '@testing-library/react';

import SelectField from '../SelectField';
import Form from 'src/components/forms/Form/Form';

const mockedSumbit = jest.fn();
const props = {
  name: 'test',
  options: [],
  selected: 'test',
};
test('renders without crashing', () => {
  render(
    <Form onSubmit={mockedSumbit}>
      <SelectField {...props} />
    </Form>,
  );
});
