import AdminAuctionsPage from '..';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { AuctionsListQuery } from 'src/apollo/queries/auctions';
import { auction } from 'src/helpers/testHelpers/auction';
import { MemoryRouter } from 'react-router-dom';
import { InMemoryCache } from '@apollo/client';
import { ToastProvider } from 'react-toast-notifications';
import { act } from 'react-dom/test-utils';
import ClickableTr from 'src/components/ClickableTr';

const cache = new InMemoryCache();

cache.writeQuery({
  query: AuctionsListQuery,
  variables: {
    size: 20,
    skip: 0,
  },
  data: {
    auctions: {
      items: [auction],
      size: 1,
      skip: 0,
      totalItems: 1,
    },
  },
});

describe('AdminAuctionsPage ', () => {
  it('component is defined but has not ClickableTr', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <AdminAuctionsPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    expect(wrapper!).toHaveLength(1);
    expect(wrapper!.find(ClickableTr)).toHaveLength(0);
  });
  it('component is defined and has ClickableTr', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache}>
              <AdminAuctionsPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(wrapper!).toHaveLength(1);
    expect(wrapper!.find(ClickableTr)).toHaveLength(1);
  });
});
