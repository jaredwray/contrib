import { render } from '@testing-library/react';

import HeartIcon from 'src/assets/images/Heart';

const props = {
  followed: true,
};

test('renders without crashing', () => {
  render(<HeartIcon {...props} />);
});
