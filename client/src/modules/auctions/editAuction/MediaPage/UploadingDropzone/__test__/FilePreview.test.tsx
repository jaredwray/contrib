import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
import FilePreview from '../FilePreview';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  file: {
    type: 'test/type',
  },
};

global.URL.createObjectURL = jest.fn();

test('renders without crashing', async () => {
  await act(async () => {
    render(
      <Router>
        <MockedProvider>
          <FilePreview {...props} />
        </MockedProvider>
      </Router>,
    );
  });
});
