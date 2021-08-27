import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';

import Form from 'src/components/Form/Form';
import { Modal } from '../Modal/';
import { ShippingRegistrationMutation } from 'src/apollo/queries/auctions';

describe('Should render correctly "Modal"', () => {
  const props: any = {
    open: true,
    onClose: jest.fn(),
    props: {
      auctionId: 'testId',
      deliveryMethod: '03',
      expirationDate: '11',
      number: '4242424242424242',
      securityCode: '123',
      shippingCost: { amount: 1170, currency: 'USD', precision: 2 },
      timeInTransit: '2021-08-27',
    },
    mutation: ShippingRegistrationMutation,
  };
  const mockFn = jest.fn();

  const mocks = [
    {
      request: {
        query: ShippingRegistrationMutation,
        variables: {
          auctionId: 'testId',
          deliveryMethod: '03',
          type: '11',
          number: '4242424242424242',
          expirationDate: '11',
          securityCode: '123',
          timeInTransit: '2021-08-27',
        },
      },
      newData: () => {
        mockFn();
        return {
          data: {
            shippingRegistration: {
              deliveryPrice: { amount: 1, currency: 'USD' },
              identificationNumber: '123',
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

  xit('should submit the form and call the mutation', async () => {
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
    });
  });
});
