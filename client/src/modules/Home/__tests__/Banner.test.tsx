import { render } from '@testing-library/react';

import Banner from '../Banner';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

test('renders without crashing', () => {
  render(<Banner />);
});
