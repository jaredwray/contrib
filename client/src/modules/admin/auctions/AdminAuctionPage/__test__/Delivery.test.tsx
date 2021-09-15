import { mount } from 'enzyme';
import { ToastProvider } from 'react-toast-notifications';
import { MockedProvider } from '@apollo/client/testing';

import { auctionForAdminPage } from 'src/helpers/testHelpers/auction';
import { Delivery } from '../Delivery';

describe('Should render correctly "Details"', () => {
  const props: any = {
    auction: auctionForAdminPage,
  };
  it('component is defined', () => {
    const wrapper = mount(
      <MockedProvider>
        <ToastProvider>
          <Delivery {...props} />
        </ToastProvider>
      </MockedProvider>,
    );
    expect(wrapper).toHaveLength(1);
  });
});
