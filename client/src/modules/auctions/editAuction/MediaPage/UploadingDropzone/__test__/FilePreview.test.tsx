import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import FilePreview from '../FilePreview';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  file: {
    type: 'image/jpg',
  },
};

global.URL.createObjectURL = jest.fn();

test('renders without crashing', async () => {
  render(
    <Router>
      <MockedProvider>
        <FilePreview {...props} />
      </MockedProvider>
    </Router>,
  );
});
