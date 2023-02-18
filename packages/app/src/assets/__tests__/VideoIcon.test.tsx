import { render } from '@testing-library/react';

import AddVideo from 'src/assets/icons/VideoIcon';

test('renders without crashing', () => {
  render(<AddVideo />);
});
