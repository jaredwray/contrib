import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import EndingSoon from '../EndingSoon';

test('renders without crashing', () => {
  render(
    <Router>
      <EndingSoon />
    </Router>,
  );
});
