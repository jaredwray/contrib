import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';

import Form from 'src/components/forms/Form/Form';
import { Modal } from '../BidStepValueChangeButton/Modal';
import { UpdateAuctionMutation } from 'src/apollo/queries/auctions';

delete window.location;
window.location = { ...window.location, reload: jest.fn() };

describe('Should render correctly "Modal"', () => {
  const props: any = {
    open: true,
    onClose: jest.fn(),
    getAuctionsList: jest.fn(),
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
      bidStep: { amount: 0, currency: 'USD', precision: 2 },
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
    mutation: UpdateAuctionMutation,
  };
  const mockFn = jest.fn();

  const mocks = [
    {
      request: {
        query: UpdateAuctionMutation,
        variables: { id: 'test', bidStep: { amount: 200, currency: 'USD', precision: 2 } },
      },
      newData: () => {
        mockFn();
        return {
          data: {
            updateAuction: {
              charity: { id: 'test', name: 'test' },
              endsAt: '2021-07-31T08:00:00.000Z',
              id: 'test',
              itemPrice: null,
              startsAt: '2021-07-23T08:00:00.000Z',
              startPrice: { amount: 100, currency: 'USD', precision: 2 },
            },
          },
        };
      },
    },
  ];
  const errorMocks = [
    {
      request: {
        query: UpdateAuctionMutation,
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
  it('should return when submitting value 0', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <MockedProvider>
            <Modal {...props} />
          </MockedProvider>
        </ToastProvider>,
      );
      wrapper
        .find(Form)
        .props()
        .onSubmit({ bidStep: { amount: 0, currency: 'USD', precision: 2 } });
    });
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
        .onSubmit({ bidStep: { amount: 200, currency: 'USD', precision: 2 } });
      expect(mockFn).toHaveBeenCalledTimes(1);

      await new Promise((resolve) => setTimeout(resolve));
      expect(props.onClose).toHaveBeenCalledTimes(1);
      expect(props.getAuctionsList).toHaveBeenCalledTimes(1);
    });
  });
  it('should submit the form and not call the mutation becouse of error', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <MockedProvider mocks={errorMocks}>
            <Modal {...props} />
          </MockedProvider>
        </ToastProvider>,
      );

      wrapper
        .find(Form)
        .props()
        .onSubmit({ bidStep: { amount: 200, currency: 'USD', precision: 2 } });
      expect(mockFn).toHaveBeenCalledTimes(0);
    });
  });
});
