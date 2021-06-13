import { render } from '@testing-library/react';

import Select from '..';

const props: any = {
  options: [],
  onchange: jest.fn(),
  options: [],
  selected: 'test',
};

test('renders without crashing', () => {
  render(<Select {...props} />);
});
