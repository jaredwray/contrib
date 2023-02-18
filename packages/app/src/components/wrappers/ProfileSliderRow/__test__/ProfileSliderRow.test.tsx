import { render } from '@testing-library/react';

import { ProfileSliderRow } from 'src/components/wrappers/ProfileSliderRow';

test('renders without crashing', () => {
  render(<ProfileSliderRow items={[]} />);
});
