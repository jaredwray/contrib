import { render } from '@testing-library/react';

import InactiveIcon from 'src/assets/icons/InactiveIcon';

test('renders without crashing', () => {
  render(<InactiveIcon />);
});
