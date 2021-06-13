import { render } from '@testing-library/react';

import HeartIcon from 'src/assets/images/Heart';

test('renders without crashing', () => {
  render(<HeartIcon />);
});
