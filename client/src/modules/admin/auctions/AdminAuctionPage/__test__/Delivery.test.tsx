import { mount } from 'enzyme';
import { GraphQLError } from 'graphql';
import { ToastProvider } from 'react-toast-notifications';
import { MockedProvider } from '@apollo/client/testing';

import { auctionForAdminPage } from 'src/helpers/testHelpers/auction';
import { ShippingRegistrationMutation } from 'src/apollo/queries/auctions';
import AsyncButton from 'src/components/AsyncButton';
import { Delivery } from '../Delivery';
import { act } from '@testing-library/react';

describe('Should render correctly "Details"', () => {
  const props: any = {
    auction: {
      ...auctionForAdminPage,
      delivery: { ...auctionForAdminPage.delivery, status: 'DELIVERY_PAYMENT_FAILED' },
    },
    refreshAuctionData: jest.fn(),
  };
  const mockFn = jest.fn();

  const mocks = [
    {
      request: {
        query: ShippingRegistrationMutation,
        variables: {
          auctionWinnerId: 'testId',
          auctionId: 'testId',
        },
      },
      newData: () => {
        mockFn();
        return {
          data: {
            shippingRegistration: {
              deliveryPrice: { amount: 1, currency: 'USD' },
              identificationNumber: 'test',
            },
          },
        };
      },
    },
  ];

  const errorMocks = [
    {
      request: {
        query: ShippingRegistrationMutation,
        variables: {},
      },
      newData: () => {
        mockFn();
        return {};
      },
    },
  ];
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ToastProvider>
          <Delivery {...props} />
        </ToastProvider>
      </MockedProvider>,
    );
    expect(wrapper).toHaveLength(1);
  });
  it('should call mutation ', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ToastProvider>
          <Delivery {...props} />
        </ToastProvider>
      </MockedProvider>,
    );
    const e: any = Event;
    await act(async () => {
      wrapper.find(AsyncButton).prop('onClick')!(e);
      await new Promise((resolve) => setTimeout(resolve));
    });
    expect(wrapper.find(AsyncButton).text()).toEqual('Pay for delivery');

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(props.refreshAuctionData).toHaveBeenCalledTimes(1);
  });
  it('should not call mutation becouse of error', async () => {
    const wrapper = mount(
      <MockedProvider mocks={errorMocks}>
        <ToastProvider>
          <Delivery {...props} />
        </ToastProvider>
      </MockedProvider>,
    );
    const e: any = Event;
    await act(async () => {
      wrapper.find(AsyncButton).prop('onClick')!(e);
      await new Promise((resolve) => setTimeout(resolve));
    });

    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});
