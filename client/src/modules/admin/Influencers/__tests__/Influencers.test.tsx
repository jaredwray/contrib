import { act } from 'react-dom/test-utils';
import { AllInfluencersQuery } from 'src/apollo/queries/influencers';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';

import { MemoryRouter } from 'react-router-dom';
import { InMemoryCache } from '@apollo/client';

import { ToastProvider } from 'react-toast-notifications';
import Influencers from '..';

import ClickableTr from 'src/components/ClickableTr';

const cache = new InMemoryCache();

cache.writeQuery({
  query: AllInfluencersQuery,
  variables: { size: 20, skip: 0 },
  data: {
    influencers: {
      items: [{ id: 'testId', name: 'test', sport: '1231', status: 'ONBOARDED' }],
      size: 20,
      skip: 0,
      totalItems: 1,
    },
  },
});

describe('AdminAuctionPage ', () => {
  it('component returns null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <Influencers />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    expect(wrapper!.find(ClickableTr)).toHaveLength(0);
  });
  it('component is defined and has ClickableTr', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache}>
              <Influencers />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );

      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();

      expect(wrapper!).toHaveLength(1);
      expect(wrapper!.find(ClickableTr)).toHaveLength(1);
    });
  });
});
