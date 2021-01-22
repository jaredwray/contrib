import { render, screen } from '@testing-library/react'

import Footer from './Footer'

test('renders copyright with current year', () => {
  render(<Footer />)

  const currentYear = new Date().getFullYear()
  const linkElement = screen.getByText(new RegExp('COPYRIGHT '+currentYear+' CONTRIB INC.', 'gi'))

  expect(linkElement).toBeInTheDocument()
});
