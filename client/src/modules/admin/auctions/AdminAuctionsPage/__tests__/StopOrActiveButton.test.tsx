import { BrowserRouter as Router } from 'react-router-dom';
import { StopOrActiveButton } from '../StopOrActiveButton';
import { auction } from 'src/helpers/testHelpers/auction';
import { mount, ReactWrapper } from 'enzyme';
import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';
import { Modal } from 'src/modules/admin/auctions/AdminAuctionsPage/StopOrActiveButton/Modal';
describe('Should render correctly "StopOrActiveButton"', () => {
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
  const mockFn = jest.fn();

  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <ToastProvider>
        <MockedProvider>
          <Router>
            <StopOrActiveButton {...props} />
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
    wrapper.children().find(Modal).children().find('Button').first().simulate('click');
  });
});
