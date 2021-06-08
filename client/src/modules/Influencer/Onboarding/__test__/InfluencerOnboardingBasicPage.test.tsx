import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { MyAccountQuery } from 'src/apollo/queries/myAccountQuery';

import { InfluencerOnboardingBasicPage } from '../InfluencerOnboardingBasicPage';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  name: 'test name',
  sport: 'soccer',
  team: 'MU',
  profileDescription: 'test',
};

const cache = new InMemoryCache();
cache.writeQuery({
  query: MyAccountQuery,
  data: {
    myAccount: {},
  },
});

test('renders without crashing', () => {
  render(
    <Router>
      <ToastProvider>
        <MockedProvider cache={cache}>
          <InfluencerOnboardingBasicPage {...props} />
        </MockedProvider>
      </ToastProvider>
    </Router>,
  );
});
