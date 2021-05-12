import { render } from '@testing-library/react';

import { InfluencerProfileSliderRow } from 'src/components/InfluencerProfileSliderRow';

test('renders without crashing', () => {
  render(<InfluencerProfileSliderRow name="name" items={[]} status="status" />);
});
