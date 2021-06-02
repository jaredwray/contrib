import { render } from '@testing-library/react';

import SearchInput from '../';
const props = {
  onChange: jest.fn(),
  onCancel: jest.fn(),
  onClick: jest.fn(),
  disabled: false,
  placeholder: 'test',
  className: 'test',
};

test('renders without crashing', () => {
  render(<SearchInput {...props} />);
});
