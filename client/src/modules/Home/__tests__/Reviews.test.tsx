import { render } from '@testing-library/react';

import Reviews from '../Testimonials';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

test('renders without crashing', () => {
  render(<Reviews />);
});
