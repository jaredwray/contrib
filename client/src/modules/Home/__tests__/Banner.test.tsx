import { render } from '@testing-library/react';

import Banner from '../Banner';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

test('renders without crashing', () => {
  render(<Banner />);
});
