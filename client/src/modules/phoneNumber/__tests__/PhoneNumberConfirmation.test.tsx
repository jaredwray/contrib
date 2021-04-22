import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import { MyAccountQuery } from 'src/apollo/queries/myAccountQuery';
import { UserAccountStatus } from 'src/types/UserAccount';

import PhoneNumberConfirmation from '../Confirmation';

const cache = new InMemoryCache();
cache.writeQuery({
  query: MyAccountQuery,
  data: {
    myAccount: {
      id: '123',
      phoneNumber: '123',
      status: UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED,
      influencerProfile: null,
      isAdmin: false,
      createdAt: '2021-02-18T14:36:35.208+00:00',
      notAcceptedTerms: null,
      assistant: null,
      paymentInformation: null,
    },
  },
});

const mockHistoryReplace = jest.fn();
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as object),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));

test('renders without crashing', () => {
  render(
    <MockedProvider cache={cache}>
      <PhoneNumberConfirmation />
    </MockedProvider>,
  );
});
