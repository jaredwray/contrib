import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import Footer from '../Footer';

test('renders copyright with current year', () => {
  render(
    <Router>
      <Footer />
    </Router>,
  );

  const currentYear = new Date().getFullYear();
  const linkElement = screen.getByText(new RegExp('COPYRIGHT ' + currentYear + ' CONTRIB INC.', 'gi'));

  expect(linkElement).toBeInTheDocument();
});
