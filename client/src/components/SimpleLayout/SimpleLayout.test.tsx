import { render } from '@testing-library/react';

import SimpleLayout from './SimpleLayout';

test('renders without crashing', () => {
  render(<SimpleLayout />);
});
