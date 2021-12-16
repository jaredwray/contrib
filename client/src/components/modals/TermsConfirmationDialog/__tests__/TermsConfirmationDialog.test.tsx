import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';

import Form from 'src/components/forms/Form/Form';
import { testAccount } from 'src/helpers/testHelpers/account';
import { AcceptAccountTermsMutation } from 'src/apollo/queries/terms';
import TermsConfirmationDialog from 'src/components/modals/TermsConfirmationDialog';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';

let assignMock = jest.fn();

delete window.location;
window.location = { assign: assignMock };

describe('TermsConfirmationDialog', () => {
  afterEach(() => {
    jest.clearAllMocks();
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

  const testAccountWithDiff = { account: { ...testAccount.account, notAcceptedTerms: '1.0' } };
  it('should return null', () => {
    let wrapper: ReactWrapper;
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
    expect(wrapper.find('Dialog')).toHaveLength(0);
  });
  it('component is defined', () => {
    let wrapper: ReactWrapper;
    wrapper = mount(
      <MemoryRouter>
        <ToastProvider>
          <MockedProvider>
            <UserAccountContext.Provider value={testAccountWithDiff}>
              <TermsConfirmationDialog />
            </UserAccountContext.Provider>
          </MockedProvider>
        </ToastProvider>
      </MemoryRouter>,
    );
    expect(wrapper.find('Dialog')).toHaveLength(1);
  });
  it('should submit form and not call the mutation becouse of false submit values', async () => {
    let wrapper: ReactWrapper;

    wrapper = mount(
      <MemoryRouter>
        <ToastProvider>
          <MockedProvider mocks={mocks}>
            <UserAccountContext.Provider value={testAccountWithDiff}>
              <TermsConfirmationDialog />
            </UserAccountContext.Provider>
          </MockedProvider>
        </ToastProvider>
      </MemoryRouter>,
    );

    await act(async () => {
      wrapper.find(Form).props().onSubmit({ terms: false });
    });
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
  xit('should submit form and call the mutation', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <ToastProvider>
            <MockedProvider mocks={mocks}>
              <UserAccountContext.Provider value={testAccountWithDiff}>
                <TermsConfirmationDialog />
              </UserAccountContext.Provider>
            </MockedProvider>
          </ToastProvider>
        </MemoryRouter>,
      );
    });
    await act(async () => {
      wrapper.find(Form).props().onSubmit({ terms: true });
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
