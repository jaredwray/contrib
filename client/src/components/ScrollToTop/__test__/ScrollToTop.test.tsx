import { render } from '@testing-library/react';

import { ScrollToTop } from '..';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';

test('renders without crashing', () => {
  document.documentElement.scrollTo = function () {};
  render(
    <MemoryRouter>
      <MockedProvider>
        <ScrollToTop />
      </MockedProvider>
    </MemoryRouter>,
  );
});
