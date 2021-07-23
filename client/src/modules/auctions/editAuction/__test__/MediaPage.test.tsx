import { GetAuctionMediaQuery } from 'src/apollo/queries/auctions';
import EditAuctionMediaPage from '../MediaPage';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { InMemoryCache } from '@apollo/client';
import Layout from 'src/components/Layout';
import { act } from 'react-dom/test-utils';
import { ToastProvider } from 'react-toast-notifications';
import AttachmentModal from 'src/components/AttachmentModal';
import UploadingDropzone from 'src/modules/auctions/editAuction/MediaPage/UploadingDropzone';
import Form from 'src/components/Form/Form';
import StepByStepRow from 'src/components/StepByStepRow';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    auctionId: 'testId',
  }),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useRouteMatch: () => ({ url: '/auctions/testId' }),
}));
const cache = new InMemoryCache();

cache.writeQuery({
  query: GetAuctionMediaQuery,
  variables: { id: 'testId' },
  data: {
    auction: {
      attachments: [
        { cloudflareUrl: null, thumbnail: null, type: 'IMAGE', uid: null, url: 'https://storage.googleapis.com/' },
      ],
      isActive: true,
      title: 'test',
    },
  },
});

describe('EditAuctionMediaPage ', () => {
  it('component return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <EditAuctionMediaPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(wrapper!.find(Layout)).toHaveLength(0);
  });
  it('component is defined and has Layout', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache}>
              <EditAuctionMediaPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(wrapper!).toHaveLength(1);
    expect(wrapper!.find(Layout)).toHaveLength(1);
    wrapper!.find(AttachmentModal).props().closeModal();
    wrapper!.find(Form).props().onSubmit({ data: {} });
    wrapper!.find(StepByStepRow).children().find('Button').at(0).simulate('click');
    wrapper!.find(UploadingDropzone).props().setErrorMessage('test');
  });
});
