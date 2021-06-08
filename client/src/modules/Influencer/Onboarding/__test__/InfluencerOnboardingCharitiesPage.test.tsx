import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { MyProfileQuery } from 'src/apollo/queries/profile';

import { InfluencerOnboardingCharitiesPage } from '../InfluencerOnboardingCharitiesPage';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  favoriteCharities: [],
};

const cache = new InMemoryCache();
cache.writeQuery({
  query: MyProfileQuery,
  data: {
    myAccount: {},
  },
});

test('renders without crashing', () => {
  render(
    <Router>
      <ToastProvider>
        <MockedProvider cache={cache}>
          <InfluencerOnboardingCharitiesPage {...props} />
        </MockedProvider>
      </ToastProvider>
    </Router>,
  );
});
