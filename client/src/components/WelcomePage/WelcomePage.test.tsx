import { render } from '@testing-library/react';

import WelcomePage from './WelcomePage';

test('renders without crashing', () => {
  render(<WelcomePage />);
});
