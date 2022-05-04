import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { InMemoryCache } from '@apollo/client';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';

import Layout from 'src/components/layouts/Layout';
import Form from 'src/components/forms/Form/Form';
import StepByStepPageLayout from 'src/components/layouts/StepByStepPageLayout';
import { testAccount } from 'src/helpers/testHelpers/account';
import { auctionForCreation as auction } from 'src/helpers/testHelpers/auction';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import { GetAuctionDetailsQuery, UpdateAuctionMutation } from 'src/apollo/queries/auctions';

import FairMarketValuePage from '../FairMarketValuePage';
import MultipleFMV from '../FairMarketValuePage/MultipleFairMarketValue';

const mockHistoryFn = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    auctionId: 'testId',
  }),
  useHistory: () => ({
    replace: mockHistoryFn,
    push: mockHistoryFn,
    goBack: mockHistoryFn,
  }),
  useRouteMatch: () => ({ url: '/admin/auctions/testId' }),
}));
const cache = new InMemoryCache();
const cache2 = new InMemoryCache();
const cacheWithMultipleItems = new InMemoryCache();
const nullDataCache = new InMemoryCache();
const undefinedlDataCache = new InMemoryCache();

const auctionItems = [
  {
    id: '2a7af71e-c43f-4fd2-926d-ce3e9b849938',
    name: 'qwe',
    contributor: 'qwe',
    fairMarketValue: { amount: 200, currency: 'USD' },
  },
  {
    id: '12076460-803e-4b98-9be7-7bd3adc54d4c',
    name: 'qwe',
    contributor: 'qwe',
    fairMarketValue: { amount: 200, currency: 'USD' },
  },
];
cache.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: {
    auction,
  },
});
cache2.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: {
    auction: {
      ...auction,
      isActive: false,
    },
  },
});
cacheWithMultipleItems.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: {
    auction: {
      ...auction,
      isActive: false,
      items: auctionItems,
      fairMarketValue: null,
    },
  },
});

nullDataCache.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: { auction: null },
});

undefinedlDataCache.writeQuery({
  query: GetAuctionDetailsQuery,
  variables: { id: 'testId' },
  data: { auction: undefined },
});

const mockFn = jest.fn();

const mocks = [
  {
    request: {
      query: UpdateAuctionMutation,
      variables: { id: 'testId', input: { fairMarketValue: { amount: 100, currency: 'USD', precision: 2 } } },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          updateAuction: {
            id: 'testId',
            description: 'test',
            title: 'test',
            link: 'test',
            startsAt: '2021-07-01T22:28:00.261Z',
            endsAt: '2021-08-14T19:01:00.232Z',
            startPrice: { amount: 100, currency: 'USD', precision: 2 },
            itemPrice: null,
            charity: {
              id: 'testId',
              name: 'test',
            },
            fairMarketValue: { amount: 100, currency: 'USD', precision: 2 },
            items: [],
          },
        },
      };
    },
  },
];

const mockWithMultipleItems = [
  {
    request: {
      query: UpdateAuctionMutation,
      variables: {
        id: 'testId',
        input: {
          items: auctionItems,
        },
      },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          updateAuction: {
            id: 'testId',
            description: 'test',
            title: 'test',
            link: 'test',
            startsAt: '2021-07-01T22:28:00.261Z',
            endsAt: '2021-08-14T19:01:00.232Z',
            startPrice: { amount: 100, currency: 'USD', precision: 2 },
            itemPrice: null,
            charity: {
              id: 'testId',
              name: 'test',
            },
            fairMarketValue: null,
            items: auctionItems,
          },
        },
      };
    },
  },
];

const errorMocks = [
  {
    request: {
      query: UpdateAuctionMutation,
      variables: {},
    },
    newData: () => {
      mockFn();
      return {
        data: {},
      };
    },
  },
];
const submitValuesWithFMV = {
  fairMarketValue: { amount: 100, currency: 'USD', precision: 2 },
};

const submitValuesWithMultipleItems = {
  fairMarketValue: {
    amount: 1100,
    currency: 'USD',
    precision: 2,
  },
  'name_2a7af71e-c43f-4fd2-926d-ce3e9b849938': 'qwe',
  'contributor_2a7af71e-c43f-4fd2-926d-ce3e9b849938': 'qwe',
  'fairMarketValue_2a7af71e-c43f-4fd2-926d-ce3e9b849938': {
    amount: 200,
    currency: 'USD',
  },
  'name_12076460-803e-4b98-9be7-7bd3adc54d4c': 'qwe',
  'contributor_12076460-803e-4b98-9be7-7bd3adc54d4c': 'qwe',
  'fairMarketValue_12076460-803e-4b98-9be7-7bd3adc54d4c': {
    amount: 200,
    currency: 'USD',
  },
};

const submitValuesWithEmptyFMV = {
  fairMarketValue: {
    amount: 200,
    currency: 'USD',
    precision: 2,
  },
  'name_2a7af71e-c43f-4fd2-926d-ce3e9b849938': 'qwe',
  'contributor_2a7af71e-c43f-4fd2-926d-ce3e9b849938': 'qwe',
  'fairMarketValue_2a7af71e-c43f-4fd2-926d-ce3e9b849938': {
    amount: 0,
    currency: 'USD',
  },
  'name_12076460-803e-4b98-9be7-7bd3adc54d4c': 'qwe',
  'contributor_12076460-803e-4b98-9be7-7bd3adc54d4c': 'qwe',
  'fairMarketValue_12076460-803e-4b98-9be7-7bd3adc54d4c': {
    amount: 200,
    currency: 'USD',
  },
};

const submitValuesWithEmptyName = {
  ...submitValuesWithMultipleItems,
  ['name_2a7af71e-c43f-4fd2-926d-ce3e9b849938']: '',
};

const submitValuesWithEmptyContributor = {
  ...submitValuesWithMultipleItems,
  ['contributor_2a7af71e-c43f-4fd2-926d-ce3e9b849938']: '',
};

describe('EditFairMarketValuePage ', () => {
  it('component return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider>
              <FairMarketValuePage />
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
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache}>
                <FairMarketValuePage />
              </MockedProvider>
            </UserAccountContext.Provider>
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

    wrapper!.find(StepByStepPageLayout).prop('prevAction')!();
  });
  it('component should return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={undefinedlDataCache}>
              <FairMarketValuePage />
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
  it('component should redirect to 404 page', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={nullDataCache}>
              <FairMarketValuePage />
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
  it('component should redirect if isActive true', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider cache={cache}>
              <FairMarketValuePage />
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
  it('should submit form and not call the mutation', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache} mocks={mocks}>
                <FairMarketValuePage />
              </MockedProvider>
            </UserAccountContext.Provider>
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
        .onSubmit({ fairMarketValue: { amount: 0, currency: 'USD', precision: 2 } });
    });
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
  it('should submit form and call the mutation and goBack', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache2} mocks={mocks}>
                <FairMarketValuePage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    await act(async () => {
      wrapper!.find(Form).props().onSubmit(submitValuesWithFMV);
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockHistoryFn).toHaveBeenCalled();
  });
  it('should submit form with multiple auction items, call the mutation and goBack', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cacheWithMultipleItems} mocks={mockWithMultipleItems}>
                <FairMarketValuePage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    await act(async () => {
      const multipleFMV = wrapper!.find(MultipleFMV);
      multipleFMV.props().handleAddItem();
      multipleFMV.props().handleRemoveCurrentItem('2a7af71e-c43f-4fd2-926d-ce3e9b849938');
      multipleFMV.props().handleBack();
      wrapper!.find(Form).props().onSubmit(submitValuesWithMultipleItems);
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockHistoryFn).toHaveBeenCalled();
  });
  it('should submit form with multiple and not call the mutation because of empty name', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cacheWithMultipleItems} mocks={mockWithMultipleItems}>
                <FairMarketValuePage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    await act(async () => {
      wrapper!.find(MultipleFMV).props().updateFormState('name_2a7af71e-c43f-4fd2-926d-ce3e9b849938', '');
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    await act(async () => {
      wrapper!.find(Form).props().onSubmit(submitValuesWithEmptyName);
    });
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
  it('should submit form with multiple and not call the mutation because of empty contributor', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cacheWithMultipleItems} mocks={mockWithMultipleItems}>
                <FairMarketValuePage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    await act(async () => {
      wrapper!.find(MultipleFMV).props().updateFormState('contributor_2a7af71e-c43f-4fd2-926d-ce3e9b849938', '');
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    await act(async () => {
      wrapper!.find(Form).props().onSubmit(submitValuesWithEmptyContributor);
    });
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
  it('should submit form with multiple items and not call the mutation because of empty fairMarketValue', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cacheWithMultipleItems} mocks={mockWithMultipleItems}>
                <FairMarketValuePage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    await act(async () => {
      wrapper!.find(MultipleFMV).props().updateFormState('fairMarketValue_2a7af71e-c43f-4fd2-926d-ce3e9b849938', {
        amount: 0,
        currency: 'USD',
        precision: 2,
      });
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    await act(async () => {
      wrapper!.find(Form).props().onSubmit(submitValuesWithEmptyFMV);
    });
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
  it('should submit form and not call the mutation because of error', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache} mocks={mocks}>
                <FairMarketValuePage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    await act(async () => {
      wrapper!.find(Form).props().onSubmit(submitValuesWithFMV);
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockHistoryFn).toHaveBeenCalled();
  });
  it('should submit form and call the mutation and push', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider cache={cache} mocks={errorMocks}>
                <FairMarketValuePage />
              </MockedProvider>
            </UserAccountContext.Provider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    await act(async () => {
      wrapper!.find(Form).props().onSubmit(submitValuesWithFMV);
    });
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});
