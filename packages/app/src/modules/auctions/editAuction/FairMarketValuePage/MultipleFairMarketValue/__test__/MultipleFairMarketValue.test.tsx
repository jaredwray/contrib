import { mount } from 'enzyme';
import { ToastProvider } from 'react-toast-notifications';

import Form from 'src/components/forms/Form/Form';

import MultipleFairMarketValue from '../index';

describe('Should render correctly "MultipleFairMarketValue"', () => {
  const mockedSumbit = jest.fn();

  const props: any = {
    formState: [
      {
        id: '620614b662881a2ce8a4676a',
        name: 'test name 1 long test name long test name',
        contributor: 'contributor with long lonh long long name',
        fairMarketValue: {
          amount: 20000,
          currency: 'USD',
          precision: 2,
        },
      },
      {
        id: '620614b662881a2ce8a4676b',
        name: 'item name 2',
        contributor: 'contibotor name 2',
        fairMarketValue: {
          amount: 10000,
          currency: 'USD',
          precision: 2,
        },
      },
    ],
    updating: false,
    handleAddItem: () => {},
    handleBack: () => {},
    handleRemoveCurrentItem: () => {},
    updateFormState: () => {},
  };

  it('component is defined', () => {
    let wrapper = mount(
      <Form onSubmit={mockedSumbit}>
        <ToastProvider>
          <MultipleFairMarketValue {...props} />
        </ToastProvider>
      </Form>,
    );

    expect(wrapper).toHaveLength(1);
  });
});
