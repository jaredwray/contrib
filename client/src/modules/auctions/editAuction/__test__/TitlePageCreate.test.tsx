import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { Route, MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';
import { createMemoryHistory } from 'history';

import Form from 'src/components/forms/Form/Form';
import { testAccount } from 'src/helpers/testHelpers/account';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import { CreateAuctionMutation } from 'src/apollo/queries/auctions';

import TitlePageEdit from '../TitlePage';

const mockFn = jest.fn();
const submitValues = { title: 'test' };

describe('EditAuctionTitlePageEdit ', () => {
  describe('for an admin', () => {
    const mocks = [
      {
        request: {
          query: CreateAuctionMutation,
          variables: { title: 'test', organizerId: 'ownerId' },
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

    describe('with valid data', () => {
      it('creates new auction', async () => {
        let wrapper: ReactWrapper;
        await act(async () => {
          wrapper = mount(
            <MemoryRouter initialEntries={['/auctions/ownerId/new']}>
              <Route path="/auctions/:ownerId/new">
                <ToastProvider>
                  <UserAccountContext.Provider value={testAccount}>
                    <MockedProvider mocks={mocks}>
                      <TitlePageEdit />
                    </MockedProvider>
                  </UserAccountContext.Provider>
                </ToastProvider>
              </Route>
            </MemoryRouter>,
          );
        });
        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve));
          wrapper.update();
        });
        await act(async () => {
          await wrapper!.find(Form).props().onSubmit(submitValues);
        });
        expect(mockFn).toHaveBeenCalledTimes(1);
      });
    });

    describe('with invalid data', () => {
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

      it('does not create new auction and display an error', async () => {
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
  });
  describe('for an influencer', () => {
    const mocks = [
      {
        request: {
          query: CreateAuctionMutation,
          variables: { title: 'test' },
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

    describe('with valid data', () => {
      it('creates new auction', async () => {
        const account = {
          ...testAccount,
          isAdmin: false,
        };
        let wrapper: ReactWrapper;
        await act(async () => {
          wrapper = mount(
            <MemoryRouter initialEntries={['/auctions/new']}>
              <Route path="/auctions/new">
                <ToastProvider>
                  <UserAccountContext.Provider value={testAccount}>
                    <MockedProvider mocks={mocks}>
                      <TitlePageEdit />
                    </MockedProvider>
                  </UserAccountContext.Provider>
                </ToastProvider>
              </Route>
            </MemoryRouter>,
          );
        });
        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve));
          wrapper.update();
        });
        await act(async () => {
          await wrapper!.find(Form).props().onSubmit(submitValues);
        });
        expect(mockFn).toHaveBeenCalledTimes(1);
      });
    });
  });
});
