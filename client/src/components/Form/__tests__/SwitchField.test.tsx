import { render } from '@testing-library/react';

import SwitchField from '../SwitchField';
import Form from 'src/components/Form/Form';

const mockedSumbit = jest.fn();
const props = {
  name: 'test',
  title: 'test',
};
test('renders without crashing', () => {
  render(
    <Form onSubmit={mockedSumbit}>
      <SwitchField {...props} />
    </Form>,
  );
});
