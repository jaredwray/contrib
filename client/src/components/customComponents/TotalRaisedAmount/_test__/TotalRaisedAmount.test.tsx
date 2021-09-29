import { render } from '@testing-library/react';

import { TotalRaisedAmount } from 'src/components/customComponents/TotalRaisedAmount';

test('renders without crashing', () => {
  render(<TotalRaisedAmount value={{ amount: 100, currency: 'USD', precision: 2 }} />);
});
