import { BidStepValueChangeButton } from '../BidStepValueChangeButton';
import { BrowserRouter as Router } from 'react-router-dom';
import { auction } from 'src/helpers/testHelpers/auction';
import { mount, ReactWrapper } from 'enzyme';
import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';
import { Modal } from 'src/modules/admin/auctions/AdminAuctionsPage/BidStepValueChangeButton/Modal';
import { act } from 'react-dom/test-utils';
describe('Should render correctly "BidStepValueChangeButton"', () => {
  const props: any = {
    auction,
    mutation: gql`
      mutation test($name: String!) {
        test(name: $name) {
          name
        }
      }
    `,
    className: jest.fn(),
  };

  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <ToastProvider>
        <MockedProvider>
          <Router>
            <BidStepValueChangeButton {...props} />
          </Router>
        </MockedProvider>
      </ToastProvider>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('it should open Modal when clicking', () => {
    wrapper.children().find('Button').simulate('click');
  });
  it('it should close Modal when clicking', () => {
    wrapper.children().find('Button').simulate('click');
    act(() => {
      wrapper.children().find(Modal).props().onClose();
    });
  });
});
