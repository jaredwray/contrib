import { render } from '@testing-library/react';
import { ToastProvider } from 'react-toast-notifications';

import ShareBtn from '..';

const props: any = {
  link: 'link',
};

test('renders without crashing', () => {
  render(
    <ToastProvider>
      <ShareBtn {...props} />
    </ToastProvider>,
  );
});
