import { render } from '@testing-library/react';

import StepByStepRow from '..';

const props = {
  loading: true,
};

test('renders without crashing', () => {
  render(<StepByStepRow {...props} />);
});
