import { render } from '@testing-library/react';

import { TotalRaisedAmount } from 'src/components/TotalRaisedAmount';

test('renders without crashing', () => {
  render(<TotalRaisedAmount auctions={[]} />);
});
