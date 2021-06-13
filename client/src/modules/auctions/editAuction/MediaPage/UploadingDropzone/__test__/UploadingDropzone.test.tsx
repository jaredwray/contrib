import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';

import UploadingDropzone from '..';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  accepted: 'test accepted',
  auctionId: 'test id',
  attachments: { uploaded: [], loading: [] },
  setAttachments: jest.fn(),
  setErrorMessage: jest.fn(),
  setSelectedAttachment: jest.fn(),
};

test('renders without crashing', async () => {
  await act(async () => {
    render(
      <Router>
        <MockedProvider>
          <UploadingDropzone {...props} />
        </MockedProvider>
      </Router>,
    );
  });
});
