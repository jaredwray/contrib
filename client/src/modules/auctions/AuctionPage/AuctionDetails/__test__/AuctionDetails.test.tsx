import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { auction } from '../../../../../helpers/testHelpers/auction';

import AuctionDetails from '..';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  auction,
};

test('renders without crashing', () => {
  render(
    <Router>
      <ToastProvider>
        <MockedProvider>
          <AuctionDetails {...props} />
        </MockedProvider>
      </ToastProvider>
    </Router>,
  );
});
