import { BrowserRouter as Router } from 'react-router-dom';
import { shallow } from 'enzyme';

import PageForm from '../BasicPage/PageForm';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

test('renders without crashing', () => {
  shallow(
    <Router>
      <PageForm />
    </Router>,
  );
});
