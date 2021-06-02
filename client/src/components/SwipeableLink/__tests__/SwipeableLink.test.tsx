import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import SwipeableLink from '..';

// const mockedSumbit = jest.fn();
const props = {
  to: '/test',
  children: <>test</>,
};

test('renders without crashing', () => {
  render(
    <Router>
      <SwipeableLink {...props} />
    </Router>,
  );
});
