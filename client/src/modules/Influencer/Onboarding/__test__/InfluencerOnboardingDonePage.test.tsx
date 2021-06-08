import { BrowserRouter as Router } from 'react-router-dom';
import { shallow } from 'enzyme';

import { InfluencerOnboardingDonePage } from '../InfluencerOnboardingDonePage';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

test('renders without crashing', () => {
  shallow(
    <Router>
      <InfluencerOnboardingDonePage />
    </Router>,
  );
});
