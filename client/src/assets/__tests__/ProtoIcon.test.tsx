import { render } from '@testing-library/react';

import AddPhoto from 'src/assets/images/ProtoIcon';

test('renders without crashing', () => {
  render(<AddPhoto />);
});
