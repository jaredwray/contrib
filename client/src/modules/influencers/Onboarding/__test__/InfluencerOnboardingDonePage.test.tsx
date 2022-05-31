import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';

import { InfluencerOnboardingDonePage } from '../InfluencerOnboardingDonePage';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

test('renders without crashing', () => {
  render(
    <Router>
      <InfluencerOnboardingDonePage />
    </Router>,
  );
});
