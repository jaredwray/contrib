import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { BrowserRouter as Router } from 'react-router-dom';

import Layout from 'src/components/Layout';

import DeliveryAddressPage from '..';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('DeliveryAddressPage', () => {
  it('component returns null', async () => {
    let wrapper: ReactWrapper;

    await act(async () => {
      wrapper = mount(
        <Router>
          <ToastProvider>
            <MemoryRouter initialEntries={['auctions/fake-id/delivery-address']}>
              <MockedProvider>
                <DeliveryAddressPage />
              </MockedProvider>
            </MemoryRouter>
          </ToastProvider>
        </Router>,
      );
    });
    expect(wrapper!.find(Layout)).toHaveLength(0);
  });
});
