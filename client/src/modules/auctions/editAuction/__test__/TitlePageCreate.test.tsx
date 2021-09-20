import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';

import Form from 'src/components/Form/Form';
import { testAccount } from 'src/helpers/testHelpers/account';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { CreateAuctionMutation } from 'src/apollo/queries/auctions';

import TitlePageEdit from '../TitlePage';

const mockHistoryFn = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    ownerId: 'testId',
  }),
  useHistory: () => ({
    push: mockHistoryFn,
  }),
}));

const mockFn = jest.fn();

const mocks = [
  {
    request: {
      query: CreateAuctionMutation,
      variables: { title: 'test', organizerId: 'testId' },
    },
    newData: () => {
      mockFn();
      return {
        data: {
          createAuction: {
            id: 'testId',
            title: 'test',
          },
        },
      };
    },
  },
];
const errorMocks = [
  {
    request: {
      query: CreateAuctionMutation,
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

const submitValues = {
  title: 'test',
};
describe('EditAuctionTitlePageEdit ', () => {
  it('should submit form and call the mutation and push to the description page', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider mocks={mocks}>
                <TitlePageEdit />
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
      wrapper!.find(Form).props().onSubmit(submitValues);
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockHistoryFn).toHaveBeenCalled();
  });
  it('should submit form and not call the mutation becouse of error', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <UserAccountContext.Provider value={testAccount}>
              <MockedProvider mocks={errorMocks}>
                <TitlePageEdit />
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
      wrapper!.find(Form).props().onSubmit(submitValues);
    });
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});
