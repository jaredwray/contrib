import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';

import { mockedUseAuth0, withNotAuthenticatedUser } from 'src/helpers/testHelpers/auth0';

import InvitationPage from '..';
import { GetInvitation } from '../../../apollo/queries/getInvitation';

const cache = new InMemoryCache();
cache.writeQuery({
  query: GetInvitation,
  data: {
    invitation: {
      firstName: 'Bob',
      welcomeMessage: 'Welcome Bob!',
    },
  },
});

describe('InvitationPage', () => {
  it('renders sign up button', async () => {
    withNotAuthenticatedUser();

    let wrapper: ReactWrapper;

    await act(async () => {
      wrapper = mount(
        <MemoryRouter initialEntries={['/invitation/fake-slug']}>
          <MockedProvider cache={cache}>
            <InvitationPage />
          </MockedProvider>
        </MemoryRouter>,
      );
    });

    const signUpButton = wrapper!.find('.invitation-page-create-btn');
    expect(signUpButton).toHaveLength(1);

    signUpButton.simulate('click');
    expect(mockedUseAuth0().loginWithRedirect).toHaveBeenCalledTimes(1);
  });

  it("influencer's first name and welcomeMessage", async () => {
    withNotAuthenticatedUser();

    let wrapper: ReactWrapper;

    await act(async () => {
      wrapper = mount(
        <MemoryRouter initialEntries={['/invitation/fake-slug']}>
          <MockedProvider cache={cache}>
            <InvitationPage />
          </MockedProvider>
        </MemoryRouter>,
      );
    });

    const firstName = wrapper!.find('.invitation-page-influencer');
    expect(firstName.text()).toEqual('Bob');

    const welcomeMessage = wrapper!.find("[data-test-id='invitation-page-welcome-message']");
    expect(welcomeMessage.text()).toEqual('Welcome Bob!');
  });
});
