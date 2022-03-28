import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { AddAuctionMediaMutation, ContentStorageAuthDataQuery } from 'src/apollo/queries/auctions';

import UploadingDropzone from '../';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    ownerId: 'testId',
  }),
}));
jest.mock('src/modules/auctions/editAuction/AuctionAttachmentsPage/UploadingDropzone/FilePreview', () => () => <></>);

global.URL.createObjectURL = jest.fn(() => 'www.test');

const props: any = {
  accepted: 'test accepted',
  auction: {
    auctionOrganizer: {
      id: 'testId',
    },
    id: 'testId',
    isActive: false,
  },
  auctionId: 'testId',
  attachments: {
    uploaded: [{ cloudflareUrl: null, thumbnail: null, type: 'IMAGE', uid: null, url: 'test' }],
    loading: [
      {
        lastModified: 1,
        lastModifiedDate: new Date(),
        name: '1.jpeg',
        path: '1.jpeg',
        size: 1,
        type: 'img/jpeg',
        webkitRelativePath: '',
      },
    ],
  },
  setAttachments: jest.fn(),
  setErrorMessage: jest.fn(),
  setSelectedAttachment: jest.fn(),
};

const createFile = (name: string, size: number, type: string) => ({
  name,
  path: name,
  size,
  type,
});

const files = [createFile('1.png', 100, 'image/png'), createFile('1.mp4', 1073741825, 'video/mp4')];

const mockAddAttachmentFn = jest.fn();

const mocks = [
  {
    request: {
      query: AddAuctionMediaMutation,
      variables: { id: 'test', file: null, uid: 'testuid', filename: 'fileName' },
    },
    newData: () => {
      mockAddAttachmentFn();
      return {
        data: {
          addAuctionAttachment: {
            id: 'test',
            type: 'IMAGE',
            cloudflareUrl: 'testURL',
            thumbnail: 'test',
            uid: 'test',
            originalFileName: 'test',
            url: 'testu',
          },
        },
      };
    },
  },
];

describe('AuctionPage ', () => {
  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <MockedProvider mocks={mocks}>
        <UploadingDropzone {...props} />
      </MockedProvider>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('component is defined and has img', async () => {
    expect(wrapper).toHaveLength(1);
    expect(wrapper.find('img')).toHaveLength(1);

    await act(async () => {
      wrapper.find('input').simulate('change', {
        target: { files },
      });
    });
  });
});
