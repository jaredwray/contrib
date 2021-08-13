import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { InMemoryCache } from '@apollo/client';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';

import Layout from 'src/components/Layout';
import Form from 'src/components/Form/Form';
import EditAuctionDetailsPage from '../DetailsPage';
import StepByStepRow from 'src/components/StepByStepRow';
import { GetAuctionDetailsQuery } from 'src/apollo/queries/auctions';
import { UpdateAuctionDetailsMutation } from 'src/apollo/queries/auctions';

const mockHistoryFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    auctionId: 'testId',
  }),
  useHistory: () => ({
    replace: mockHistoryFn,
    push: mockHistoryFn,
    location: { pathname: '/' },
  }),
  useRouteMatch: () => ({ url: '/admin/auctions/testId' }),
}));

const cache = new InMemoryCache();
const cacheDataWithChurityNull = new InMemoryCache();
const nullDataCache = new InMemoryCache();

const auction = {
  auctionOrganizer: { favoriteCharities: [] },
  charity: { id: 'testId', name: 'test' },
  endDate: '2021-07-01T22:28:00.270Z',
  id: 'testId',
  isActive: true,
  itemPrice: null,
  link: 'test',
  startDate: '2021-07-01T22:28:00.261Z',
  startPrice: { amount: 0, currency: 'USD', precision: 2 },
  timeZone: null,
  title: '1',
};

cache.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: {
    auction,
  },
});

cacheDataWithChurityNull.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: {
    auction: {
      ...auction,
      charity: null,
    },
  },
});

nullDataCache.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: { auction: null },
});

const mockFn = jest.fn();

const values = {
  charity: 'testId',
  startPrice: { amount: 100, currency: 'USD', precision: 2 },
  startDate: '2021-01-08T20:01:00.000Z',
  itemPrice: null,
  endDate: '2021-01-09T20:01:00.000Z',
  timeZone: 'PDT',
};

const mocks = [
  {
    request: {
      query: UpdateAuctionDetailsMutation,
      variables: { id: 'testId', ...values },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          updateAuction: {
            id: 'testId',
            startDate: '2021-08-13T19:01:00.232Z',
            endDate: '2021-08-14T19:01:00.232Z',
            startPrice: { amount: 100, currency: 'USD', precision: 2 },
            itemPrice: null,
            charity: {
              id: 'testId',
              name: 'test',
            },
          },
        },
      };
    },
  },
];
const submitValues = {
  charity: null,
  duration: '1',
  itemPrice: { amount: 0, currency: 'USD', precision: 2 },
  startPrice: { amount: 100, currency: 'USD', precision: 2 },
  startDate: { date: new Date('2021-01-08'), time: '12:01', timeZone: 'America/Los_Angeles' },
};

describe('EditAuctionDetailsPage ', () => {
  it('component return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <EditAuctionDetailsPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(wrapper!.find(Layout)).toHaveLength(0);
  });
  it('component is defined and has Layout', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache}>
              <EditAuctionDetailsPage />
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
    expect(wrapper!.find(Layout)).toHaveLength(1);

    wrapper!.find(StepByStepRow).children().find('Button').at(0).simulate('click');
    expect(mockHistoryFn).toHaveBeenCalledTimes(3);
  });
  it('component should redirect to 404 page', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={nullDataCache}>
              <EditAuctionDetailsPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(mockHistoryFn).toBeCalled();
  });

  it('should submit form, return becouse of churity = null and not call the mutation', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cacheDataWithChurityNull} mocks={mocks}>
              <EditAuctionDetailsPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    await act(async () => {
      wrapper!
        .find(Form)
        .props()
        .onSubmit({ ...submitValues });
    });
    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  it('should submit form and call the mutation', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache} mocks={mocks}>
              <EditAuctionDetailsPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    await act(async () => {
      wrapper!
        .find(Form)
        .props()
        .onSubmit({ ...submitValues });
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should submit form ,return and not call the mutation', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache} mocks={mocks}>
              <EditAuctionDetailsPage />
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    await act(async () => {
      wrapper!
        .find(Form)
        .props()
        .onSubmit({
          ...submitValues,
          itemPrice: { amount: 100, currency: 'USD', precision: 2 },
          startPrice: { amount: 200, currency: 'USD', precision: 2 },
        });
    });
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});
