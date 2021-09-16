import { render } from '@testing-library/react';

import AddPhoto from 'src/assets/images/PhotoIcon';

test('renders without crashing', () => {
  render(<AddPhoto />);
});
