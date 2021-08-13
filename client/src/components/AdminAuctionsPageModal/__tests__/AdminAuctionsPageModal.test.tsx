import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { ToastProvider } from 'react-toast-notifications';
import { BrowserRouter as Router } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';

import { Modal } from '..';
import { auction } from 'src/helpers/testHelpers/auction';
import AsyncButton from 'src/components/AsyncButton';
import { DeleteAuctionMutation } from 'src/apollo/queries/auctions';

delete window.location;
window.location = { ...window.location, reload: jest.fn() };

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);

describe('Should render correctly "Modal"', () => {
  const props: any = {
    open: true,
    onClose: jest.fn(),
    onConfirm: jest.fn((auction) => {
      return null;
    }),
    auction,
    mutation: DeleteAuctionMutation,
  };
  const newProps: any = {
    open: true,
    onClose: jest.fn(),
    auction,
    mutation: DeleteAuctionMutation,
  };
  const mockFn = jest.fn();

  const mocks = [
    {
      request: {
        query: DeleteAuctionMutation,
        variables: { id: auction.id },
      },
      newData: () => {
        mockFn();
        return {
          data: {
            deleteAuction: {
              id: 'test',
            },
          },
        };
      },
    },
  ];
  afterEach(() => {
    jest.clearAllMocks();
  });
  const wrapper = mount(
    <ToastProvider>
      <MockedProvider>
        <Router>
          <Modal {...props} />
        </Router>
      </MockedProvider>
    </ToastProvider>,
  );
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('should close modal', () => {
    wrapper.find('Button').first().simulate('click');
    expect(props.onClose).toBeCalledTimes(1);
  });

  it('should call mutation, onConfirm,onClose', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <MockedProvider mocks={mocks}>
            <Router>
              <Modal {...props} />
            </Router>
          </MockedProvider>
        </ToastProvider>,
      );
      wrapper.find(AsyncButton).simulate('click');

      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(props.onConfirm).toHaveBeenCalledTimes(1);
      expect(props.onClose).toHaveBeenCalledTimes(1);
    });
  });
  it('should call mutation and reload page', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <MockedProvider mocks={mocks}>
            <Router>
              <Modal {...newProps} />
            </Router>
          </MockedProvider>
        </ToastProvider>,
      );
      wrapper.find(AsyncButton).simulate('click');

      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(window.location.reload).toHaveBeenCalledTimes(1);
    });
  });
});
