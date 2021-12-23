import { mount } from 'enzyme';
import { ToastProvider } from 'react-toast-notifications';
import { MockedProvider } from '@apollo/client/testing';

import { auction } from 'src/helpers/testHelpers/auction';

import DeliveryInfo from '../index';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

const props: any = {
  auction: auction,
  isDeliveryPage: true,
};

describe('AuctionDelivery', () => {
  it('renders without crashing', () => {
   mount(
      <ToastProvider>
        <MockedProvider>
          <DeliveryInfo {...props} />
        </MockedProvider>
      </ToastProvider>,
    );
  });
});
