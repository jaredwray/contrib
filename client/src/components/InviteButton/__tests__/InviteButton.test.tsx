import { render } from '@testing-library/react';
import { gql } from '@apollo/client';
import { InviteButton } from '..';
import { MockedProvider } from '@apollo/client/testing';

const props: any = {
  mutation: gql`
    mutation test($name: String!) {
      test(name: $name) {
        name
      }
    }
  `,
};

test('renders without crashing', () => {
  render(
    <MockedProvider mocks={[]}>
      <InviteButton {...props} />
    </MockedProvider>,
  );
});
