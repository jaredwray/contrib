import { shallow } from "enzyme";
import { mockedUseAuth0, withNotAuthenticatedUser } from "../../testHelpers/auth0";
import InvitationPage from "./InvitationPage";

describe("InvitationPage", () => {
  it("renders sign up button", () => {
    withNotAuthenticatedUser();

    let wrapper = shallow(<InvitationPage />);
    let signUpButton = wrapper.find(".invitation-page-create-btn");
    expect(signUpButton).toHaveLength(1);

    signUpButton.simulate("click");
    expect(mockedUseAuth0().loginWithRedirect).toHaveBeenCalledTimes(1);
  });
});
