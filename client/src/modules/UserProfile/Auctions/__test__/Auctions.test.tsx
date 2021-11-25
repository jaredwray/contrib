import { mount, ReactWrapper } from 'enzyme';
import { ToastProvider } from 'react-toast-notifications';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { MockedProvider } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';

import { GetAuctionsForProfilePageQuery } from 'src/apollo/queries/userProfile';
import { auction } from 'src/helpers/testHelpers/auction';

import Auctions from '../index';

const cache = new InMemoryCache();

cache.writeQuery({
  query: GetAuctionsForProfilePageQuery,
  data: {
    getAuctionsForProfilePage: { won: [auction], live: [auction] },
  },
});

describe('Should render correctly "Auctions"', () => {
  it('component is defined', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache}>
              <Auctions />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );

      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(wrapper!).toHaveLength(1);
  });
});
