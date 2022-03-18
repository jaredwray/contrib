import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import Footer from '../Footer';

describe('Footer', () => {
  test('renders without crashing', () => {
    render(
      <Router>
        <Footer />
      </Router>,
    );
  });
});
