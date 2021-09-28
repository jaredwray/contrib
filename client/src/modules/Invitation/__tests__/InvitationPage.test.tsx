import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import Layout from 'src/components/layouts/Layout';
import { GetInvitation } from 'src/apollo/queries/getInvitation';
import { mockedUseAuth0, withNotAuthenticatedUser } from 'src/helpers/testHelpers/auth0';

import InvitationPage from '..';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const cache = new InMemoryCache();
cache.writeQuery({
  query: GetInvitation,
  data: {
    invitation: {
      firstName: 'Bob',
      welcomeMessage: 'Welcome Bob!',
      accepted: true,
    },
  },
});

describe('InvitationPage', () => {
  it('component returns null', async () => {
    withNotAuthenticatedUser();

    let wrapper: ReactWrapper;

    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <MemoryRouter initialEntries={['/invitation/fake-slug']}>
            <MockedProvider>
              <InvitationPage />
            </MockedProvider>
          </MemoryRouter>
        </ToastProvider>,
      );
    });
    expect(wrapper!.find(Layout)).toHaveLength(0);
  });

  it('renders sign up button', async () => {
    withNotAuthenticatedUser();

    let wrapper: ReactWrapper;

    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <MemoryRouter initialEntries={['/invitation/fake-slug']}>
            <MockedProvider cache={cache}>
              <InvitationPage />
            </MockedProvider>
          </MemoryRouter>
        </ToastProvider>,
      );
    });

    const signUpButton = wrapper!.find('.btn.invitation-page-create-btn');
    expect(signUpButton).toHaveLength(1);

    signUpButton.simulate('click');
    expect(mockedUseAuth0().loginWithRedirect).toHaveBeenCalledTimes(1);
  });

  it("influencer's first name and welcomeMessage", async () => {
    withNotAuthenticatedUser();

    let wrapper: ReactWrapper;

    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <MemoryRouter initialEntries={['/invitation/fake-slug']}>
            <MockedProvider cache={cache}>
              <InvitationPage />
            </MockedProvider>
          </MemoryRouter>
        </ToastProvider>,
      );
    });

    const firstName = wrapper!.find('.invitation-page-influencer');
    expect(firstName.text()).toEqual('Bob');

    const welcomeMessage = wrapper!.find("[data-test-id='invitation-page-welcome-message']");
    expect(welcomeMessage.text()).toEqual('Welcome Bob!');
  });
});
