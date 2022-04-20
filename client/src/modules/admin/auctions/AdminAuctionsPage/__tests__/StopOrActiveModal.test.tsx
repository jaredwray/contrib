import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';

import Form from 'src/components/forms/Form/Form';
import { Modal } from '../StopOrActiveButton/Modal';
import { StopAuctionMutation } from 'src/apollo/queries/auctions';

delete window.location;
window.location = { ...window.location, reload: jest.fn() };

describe('Should render correctly "Modal"', () => {
  const props: any = {
    open: true,
    onClose: jest.fn(),
    auction: {
      attachments: [{ thumbnail: null, type: 'IMAGE', url: 'https://storage.googleapis.com/content-dev.con' }],
      auctionOrganizer: {
        id: 'test',
        name: 'test',
        avatarUrl: 'test',
      },
      itemPrice: null,
      description: 'test',
      endsAt: '2021-07-31T08:00:00.000Z',
      fairMarketValue: { amount: 0, currency: 'USD', precision: 2 },
      followers: [{ user: 'test' }],
      id: 'test',
      isActive: true,
      isDraft: false,
      isFailed: false,
      isSettled: false,
      isSold: false,
      isStopped: false,
      startsAt: '2021-07-23T08:00:00.000Z',
      startPrice: { amount: 100, currency: 'USD', precision: 2 },
      status: 'ACTIVE',
      title: 'test',
    },
    mutation: StopAuctionMutation,
  };
  const mockFn = jest.fn();

  const mocks = [
    {
      request: {
        query: StopAuctionMutation,
        variables: { id: 'test' },
      },
      newData: () => {
        mockFn();
        return {
          data: {
            stopAuction: {
              status: 'test',
            },
          },
        };
      },
    },
  ];

  it('component is defined', () => {
    const wrapper = mount(
      <ToastProvider>
        <MockedProvider>
          <Modal {...props} />
        </MockedProvider>
      </ToastProvider>,
    );
    expect(wrapper).toHaveLength(1);
  });

  it('should submit the form and call the mutation', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <MockedProvider mocks={mocks}>
            <Modal {...props} />
          </MockedProvider>
        </ToastProvider>,
      );

      wrapper
        .find(Form)
        .props()
        .onSubmit(() => {});
      expect(mockFn).toHaveBeenCalledTimes(1);
      await new Promise((resolve) => setTimeout(resolve));

      expect(window.location.reload).toHaveBeenCalledTimes(1);
    });
  });
});
