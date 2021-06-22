import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import Form from 'src/components/Form/Form';

import StartDateField from '../DetailsPage/StartDateField';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  name: 'startDate',
};

jest.mock('react-final-form', () => ({
  ...(jest.requireActual('react-final-form') as object),
  useFormState: () => ({
    values: {
      startDate: {
        timeZone: 'America/Los_Angeles',
      },
    },
  }),
}));

test('renders without crashing', () => {
  render(
    <Router>
      <Form onSubmit={jest.fn()}>
        <StartDateField {...props} />
      </Form>
    </Router>,
  );
});
