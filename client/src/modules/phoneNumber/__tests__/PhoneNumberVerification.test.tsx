import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import { MyAccountQuery } from 'src/apollo/queries/accountQuery';
import { UserAccountStatus } from 'src/types/UserAccount';

import PhoneNumberVerification from '../Verification';

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
      charity: null,
      mongodbId: '321',
      address: {
        name: 'test name',
        state: 'test state',
        city: 'test city',
        zipCode: 'test zipCode',
        country: 'test country',
        street: 'test street',
      },
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

test('renders without crashing', async () => {
  await act(async () => {
    render(
      <MockedProvider cache={cache}>
        <PhoneNumberVerification />
      </MockedProvider>,
    );
  });
});
