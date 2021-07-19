import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import UploadingDropzone from '../';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);
jest.mock('src/modules/auctions/editAuction/MediaPage/UploadingDropzone/FilePreview', () => () => <></>);

const props: any = {
  accepted: 'test accepted',
  auctionId: 'test id',
  attachments: {
    uploaded: [
      { cloudflareUrl: null, originalFileName: 'test.jpg', thumbnail: null, type: 'IMAGE', uid: null, url: 'test' },
    ],
    loading: [
      {
        lastModified: 1619704709059,
        lastModifiedDate: 'Thu Apr 29 2021 16:58:29 GMT+0300 (Москва, стандартное время',
        name: '1.mp4',
        path: '1.mp4',
        size: 27561202,
        type: 'video/mp4',
        webkitRelativePath: '',
      },
    ],
  },
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
