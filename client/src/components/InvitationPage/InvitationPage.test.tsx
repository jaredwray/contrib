import { mount, ReactWrapper } from 'enzyme';
import { mockedUseAuth0, withNotAuthenticatedUser } from "../../testHelpers/auth0";
import { InMemoryCache } from "@apollo/client";
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import InvitationPage, { GetInvitation } from "./InvitationPage";

const cache = new InMemoryCache();
cache.writeQuery({
  query: GetInvitation,
  data: {
    invitation: {
      firstName: 'Bob',
      welcomeMessage: 'Welcome Bob!'
    },
  },
});

describe("InvitationPage", () => {
  it("renders sign up button", async () => {
    withNotAuthenticatedUser();

    let wrapper: ReactWrapper;

    await act(async () => {
      wrapper = mount(
        <MemoryRouter initialEntries={["/invitation/fake-slug"]}>
          <MockedProvider cache={cache}>
            <InvitationPage />
          </MockedProvider>
        </MemoryRouter>
      );
    });

    let signUpButton = wrapper.find(".invitation-page-create-btn");
    expect(signUpButton).toHaveLength(1);

    signUpButton.simulate("click");
    expect(mockedUseAuth0().loginWithRedirect).toHaveBeenCalledTimes(1);
  });

  it("influencer's first name and welcomeMessage", async () => {
    withNotAuthenticatedUser();

    let wrapper: ReactWrapper;

    await act(async () => {
      wrapper = mount(
        <MemoryRouter initialEntries={["/invitation/fake-slug"]}>
          <MockedProvider cache={cache}>
            <InvitationPage />
          </MockedProvider>
        </MemoryRouter>
      );
    });

    let firstName = wrapper.find(".invitation-page-influencer");
    expect(firstName.text()).toEqual('Bob');

    let welcomeMessage = wrapper.find("[data-test-id='invitation-page-welcome-message']");
    expect(welcomeMessage.text()).toEqual('Welcome Bob!');
  });
});
