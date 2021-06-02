import { render } from '@testing-library/react';

import { SubmitButton } from '..';
import AsyncButton from 'src/components/AsyncButton';
import Form from 'src/components/Form/Form';

const mockedSumbit = jest.fn();

test('renders without crashing', () => {
  render(
    <Form onSubmit={mockedSumbit}>
      <SubmitButton>
        <AsyncButton loading={true} />
      </SubmitButton>
    </Form>,
  );
});
