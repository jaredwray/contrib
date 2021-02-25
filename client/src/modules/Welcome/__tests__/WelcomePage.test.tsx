import { render } from '@testing-library/react';

import WelcomePage from '..';

test('renders without crashing', () => {
  render(<WelcomePage />);
});
