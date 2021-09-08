import { MockedProvider } from '@apollo/client/testing';
import UploadingDropzone from '../';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    ownerId: 'testId',
  }),
}));
jest.mock('src/modules/auctions/editAuction/common/UploadingDropzone/FilePreview', () => () => <></>);

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
describe('AuctionPage ', () => {
  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <MockedProvider>
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
