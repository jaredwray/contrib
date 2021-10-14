import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { mount, ReactWrapper } from 'enzyme';
import { DeleteAuctionMediaMutation } from 'src/apollo/queries/auctions';

import { CloseButton } from 'src/components/buttons/CloseButton';
import AttachmentPreview from '../AttachmentPreview';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  auctionId: 'testId',
  attachment: {
    id: 'testAttachmentId',
    cloudflareUrl: null,
    originalFileName: 'test.jpg',
    thumbnail: null,
    type: 'IMAGE',
    uid: null,
    url: 'test',
  },
  setAttachments: jest.fn(),
  setErrorMessage: jest.fn(),
  setSelectedAttachment: jest.fn(),
};
const mockFn = jest.fn();

const mocks = [
  {
    request: {
      query: DeleteAuctionMediaMutation,
      variables: { auctionId: 'testId', attachmentId: 'testAttachmentId' },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          deleteAuctionAttachment: {
            id: 'testId',
            url: 'test',
            type: 'IMAGE',
            cloudflareUrl: null,
            thumbnail: null,
            uid: null,
          },
        },
      };
    },
  },
];
const errorMocks = [
  {
    request: {
      query: DeleteAuctionMediaMutation,
      variables: {},
    },
    newData: () => {
      mockFn();
      return {
        data: {},
      };
    },
  },
];

describe('', () => {
  it('renders without crashing', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <MockedProvider>
            <AttachmentPreview {...props} />
          </MockedProvider>
        </MemoryRouter>,
      );
    });
    expect(wrapper!).toHaveLength(1);
    expect(wrapper!.find(CloseButton)).toHaveLength(1);
  });
  it('should call the mutation', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <MockedProvider mocks={mocks}>
            <AttachmentPreview {...props} />
          </MockedProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      wrapper!.find(CloseButton).simulate('click');
      wrapper.update();
    });
    expect(props.setAttachments).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  it('should not call the mutation becouse of error', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <MockedProvider mocks={errorMocks}>
            <AttachmentPreview {...props} />
          </MockedProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      wrapper!.find(CloseButton).simulate('click');
      wrapper.update();
    });
    expect(props.setErrorMessage).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});
