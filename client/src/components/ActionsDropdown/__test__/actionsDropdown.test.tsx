import { render } from '@testing-library/react';

import { ActionsDropdown } from 'src/components/ActionsDropdown';

test('renders without crashing', () => {
  render(<ActionsDropdown />);
});
