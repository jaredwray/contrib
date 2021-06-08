import { BrowserRouter as Router } from 'react-router-dom';
import { shallow } from 'enzyme';

import { InfluencerOnboardingNavigation } from '../InfluencerOnboardingNavigation';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  step: 'basic',
};

test('renders without crashing', () => {
  shallow(
    <Router>
      <InfluencerOnboardingNavigation {...props} />
    </Router>,
  );
});
