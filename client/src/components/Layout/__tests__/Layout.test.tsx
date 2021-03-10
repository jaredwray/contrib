import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import Layout from '..';

test('renders without crashing', () => {
  render(
    <Router>
      <Layout>Test</Layout>
    </Router>,
  );
});
