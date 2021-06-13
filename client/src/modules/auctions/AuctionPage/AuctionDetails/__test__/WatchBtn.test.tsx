import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { auction } from '../../../../../helpers/testHelpers/auction';

import WatchBtn from '../WatchBtn';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  auction,
};

test('renders without crashing', () => {
  render(
    <Router>
      <WatchBtn {...props} />
    </Router>,
  );
});
