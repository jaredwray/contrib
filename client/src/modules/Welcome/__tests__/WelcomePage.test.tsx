import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import WelcomePage from '..';

test('renders without crashing', () => {
  render(
    <Router>
      <WelcomePage />
    </Router>,
  );
});
