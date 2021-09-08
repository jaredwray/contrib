import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { InMemoryCache } from '@apollo/client';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';
import { GetAuctionMediaQuery } from 'src/apollo/queries/auctions';

import Layout from 'src/components/Layout';
import Form from 'src/components/Form/Form';
import StepByStepPageRow from 'src/components/StepByStepPageRow';
import AttachmentModal from 'src/components/AttachmentModal';
import UploadingDropzone from 'src/modules/auctions/editAuction/common/UploadingDropzone';
import AuctionPhotoPage from '../AuctionPhotoPage';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

const mockHistoryFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    auctionId: 'testId',
  }),
  useHistory: () => ({
    push: mockHistoryFn,
    replace: mockHistoryFn,
  }),
  useRouteMatch: () => ({ url: '/auctions/testId' }),
}));
const cache = new InMemoryCache();
const cache2 = new InMemoryCache();
const cache3 = new InMemoryCache();
const nullDataCache = new InMemoryCache();
const undefinedDataCache = new InMemoryCache();

const auction = {
  id: 'testId',
  isActive: true,
  title: 'test',
  auctionOrganizer: {
    id: 'testId',
  },
  attachments: [
    { cloudflareUrl: null, thumbnail: null, type: 'IMAGE', uid: null, url: 'https://storage.googleapis.com/' },
  ],
};
cache.writeQuery({
  query: GetAuctionMediaQuery,
  variables: { id: 'testId' },
  data: {
    auction,
  },
});
cache2.writeQuery({
  query: GetAuctionMediaQuery,
  variables: { id: 'testId' },
  data: {
    auction: { ...auction, isActive: false },
  },
});
cache3.writeQuery({
  query: GetAuctionMediaQuery,
  variables: { id: 'testId' },
  data: {
    auction: { ...auction, attachments: [], isActive: false },
  },
});
nullDataCache.writeQuery({
  query: GetAuctionMediaQuery,
  variables: { id: 'testId' },
  data: {
    auction: null,
  },
});
undefinedDataCache.writeQuery({
  query: GetAuctionMediaQuery,
  variables: { id: 'testId' },
  data: {
    auction: undefined,
  },
});

describe('AuctionPhotoPage ', () => {
  it('component returns null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <AuctionPhotoPage />
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
  it('component should redirect to Home page', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache}>
              <AuctionPhotoPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(mockHistoryFn).toBeCalled();
  });
  it('component should redirect to 404 page', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={nullDataCache}>
              <AuctionPhotoPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(mockHistoryFn).toBeCalled();
  });
  it('component is defined and has Layout', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache2}>
              <AuctionPhotoPage />
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

    wrapper!.find(StepByStepPageRow).children().find('Button').at(0).simulate('click');
    wrapper!.find(UploadingDropzone).props().setErrorMessage('test');
  });
  it('component should submit the form and redirect', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache2}>
              <AuctionPhotoPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });

    wrapper!.find(Form).props().onSubmit({});
    expect(mockHistoryFn).toHaveBeenCalled();
  });
  it('component should submit the form and return error', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache3}>
              <AuctionPhotoPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });

    wrapper!.find(Form).props().onSubmit({});
  });
});
