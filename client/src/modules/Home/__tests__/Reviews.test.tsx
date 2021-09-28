import { render } from '@testing-library/react';

import Reviews from '../Testimonials';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

test('renders without crashing', () => {
  render(<Reviews />);
});
