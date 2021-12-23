import { MockedProvider } from '@apollo/client/testing';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import { ToastProvider } from 'react-toast-notifications';

import AuctionDeliveryInfoPage from '../index';

const props: any = {
  isDeliveryPage: true,
};

test('renders without crashing AuctionDeliveryInfoPage', () => {
  mount(
    <MemoryRouter>
      <ToastProvider>
        <MockedProvider>
          <AuctionDeliveryInfoPage {...props} />
        </MockedProvider>
      </ToastProvider>
    </MemoryRouter>,
  );
});
