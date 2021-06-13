import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import Form from 'src/components/Form/Form';
import PageForm from '../BasicPage/PageForm';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

test('renders without crashing', () => {
  render(
    <Router>
      <Form onSubmit={jest.fn()}>
        <PageForm />
      </Form>
    </Router>,
  );
});
