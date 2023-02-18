import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { MemoryRouter, BrowserRouter as Router } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';
import { waitFor } from '@testing-library/react';

import Form from 'src/components/forms/Form/Form';
import { testAccount } from 'src/helpers/testHelpers/account';
import { AcceptAccountTermsMutation } from 'src/apollo/queries/terms';
import TermsConfirmationDialog from 'src/components/modals/TermsConfirmationDialog';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';

describe('TermsConfirmationDialog', () => {
  const assignMock = jest.fn();
  let wrapper: ReactWrapper;
  const oldWindowLocation = window.location;

  beforeAll(() => {
    delete window.location;
    window.location = { ...oldWindowLocation, assign: jest.fn() };
  });

  afterAll(() => {
    window.location = oldWindowLocation;
  });

  const mockFn = jest.fn();
  const mocks = [
    {
      request: {
        query: AcceptAccountTermsMutation,
        variables: {
          version: '1.0',
        },
      },
      newData: () => {
        mockFn();
        return {
          data: {
            acceptAccountTerms: {
              id: 'testId',
            },
          },
        };
      },
    },
  ];

  describe('when the user have accepted terms already', () => {
    it('should return null', async () => {
      await act(async () => {
        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider>
                <UserAccountContext.Provider value={testAccount}>
                  <TermsConfirmationDialog />
                </UserAccountContext.Provider>
              </MockedProvider>
            </ToastProvider>
          </MemoryRouter>,
        );

        await new Promise((r) => setTimeout(r, 10));
        wrapper.update();

        expect(wrapper.find('Dialog')).toHaveLength(0);
      });
    });
  });

  describe('when the user has not accepted terms', () => {
    const accountWithNotAcceptedTerms = { account: { ...testAccount.account, notAcceptedTerms: '1.0' } };

    it('component is defined', async () => {
      await act(async () => {
        global.fetch = jest.fn(async () => ({
          text: async () => 'test text',
        }));

        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider>
                <UserAccountContext.Provider value={accountWithNotAcceptedTerms}>
                  <TermsConfirmationDialog />
                </UserAccountContext.Provider>
              </MockedProvider>
            </ToastProvider>
          </MemoryRouter>,
        );

        await new Promise((r) => setTimeout(r, 10));
        wrapper.update();

        expect(wrapper.find('Dialog')).toHaveLength(1);
      });
    });

    it('does submit form when the user did not accept the terms', async () => {
      await act(async () => {
        global.fetch = jest.fn(async () => ({
          text: async () => 'test text',
        }));

        wrapper = mount(
          <MemoryRouter>
            <ToastProvider>
              <MockedProvider mocks={mocks}>
                <Router>
                  <UserAccountContext.Provider value={accountWithNotAcceptedTerms}>
                    <TermsConfirmationDialog />
                  </UserAccountContext.Provider>
                </Router>
              </MockedProvider>
            </ToastProvider>
          </MemoryRouter>,
        );

        await new Promise((r) => setTimeout(r, 10));
        wrapper.update();

        await act(async () => {
          wrapper.find(Form).props().onSubmit({ terms: false });
        });
        expect(mockFn).toHaveBeenCalledTimes(0);
      });
    });

    it('submits form when the user accepted the terms', async () => {
      await act(async () => {
        global.fetch = jest.fn(async () => ({
          text: async () => 'test text',
        }));

        wrapper = mount(
          <ToastProvider>
            <MockedProvider mocks={mocks}>
              <Router>
                <UserAccountContext.Provider value={accountWithNotAcceptedTerms}>
                  <TermsConfirmationDialog />
                </UserAccountContext.Provider>
              </Router>
            </MockedProvider>
          </ToastProvider>,
        );
        await new Promise((r) => setTimeout(r, 10));
        wrapper.update();

        await act(async () => {
          wrapper.find(Form).props().onSubmit({ terms: true });
        });
        expect(mockFn).toHaveBeenCalledTimes(1);
      });
    });
  });
});
