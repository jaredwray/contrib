import { render } from '@testing-library/react';

import { ProfileSliderRow } from 'src/components/ProfileSliderRow';

test('renders without crashing', () => {
  render(<ProfileSliderRow name="name" items={[]} status="status" />);
});
