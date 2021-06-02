import { render } from '@testing-library/react';
import { DropdownButton } from 'react-bootstrap';

import Select from '..';

const props: any = {
  options: [],
  onchange: jest.fn(),
  title: 'test',
};

test('renders without crashing', () => {
  render(
    <Select {...props}>
      <DropdownButton title={props.title} />
    </Select>,
  );
});
