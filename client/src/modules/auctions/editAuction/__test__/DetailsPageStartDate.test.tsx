import { BrowserRouter as Router } from 'react-router-dom';
import { shallow } from 'enzyme';

import StartDateField from '../DetailsPage/StartDateField';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  name: 'test name',
};

test('renders without crashing', () => {
  shallow(
    <Router>
      <StartDateField {...props} />
    </Router>,
  );
});
