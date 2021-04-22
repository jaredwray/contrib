import { render } from '@testing-library/react';

import AboutUs from '../AboutUs';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

test('renders without crashing', () => {
  render(<AboutUs />);
});
