import { render } from '@testing-library/react';

import PhoneNumberConfirmation from './PhoneNumberConfirmation';
import { MyAccountQuery } from '../../apollo/queries/MyAccountQuery';
import { UserAccountStatus } from '../../model/UserAccount';
import { MockedProvider } from '@apollo/client/testing';

const mocks = [
  {
    request: { query: MyAccountQuery },
    result: {
      data: {
        myAccount: {
          id: '123',
          phoneNumber: '123',
          status: UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED,
        },
      },
    },
  },
];

test('renders without crashing', () => {
  render(
    <MockedProvider mocks={mocks}>
      <PhoneNumberConfirmation />
    </MockedProvider>,
  );
});
