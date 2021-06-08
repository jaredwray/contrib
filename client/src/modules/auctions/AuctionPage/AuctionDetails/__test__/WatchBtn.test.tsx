import { BrowserRouter as Router } from 'react-router-dom';
import { shallow } from 'enzyme';
import { auction } from '../../../../../helpers/testHelpers/auction';

import WatchBtn from '../WatchBtn';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  auction,
};

test('renders without crashing', () => {
  shallow(
    <Router>
      <WatchBtn {...props} />
    </Router>,
  );
});
