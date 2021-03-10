import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import HomePage from '..';

test('renders without crashing', () => {
  render(
    <Router>
      <HomePage />
    </Router>,
  );
});
