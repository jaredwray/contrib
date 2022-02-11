import { mount } from 'enzyme';
import { ToastProvider } from 'react-toast-notifications';

import { AuctionItems } from '../AuctionItems';

describe('Should render correctly "AuctionItems"', () => {
  const mock = jest.fn();

  const props: any = {
    items: [
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
    showEditButton: true,
    handleEditClick: () => mock(),
  };

  it('component is defined', () => {
    const wrapper = mount(
      <ToastProvider>
        <AuctionItems {...props} />
      </ToastProvider>,
    );
    expect(wrapper).toHaveLength(1);
  });
});
