import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { mount, ReactWrapper } from 'enzyme';
import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';

import { Modal } from '..';
import { auction } from 'src/helpers/testHelpers/auction';
import AsyncButton from 'src/components/AsyncButton';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);
describe('Should render correctly "AuctionCard"', () => {
  const props: any = {
    open: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    auction,
    mutation: gql`
      mutation test($name: String!) {
        test(name: $name) {
          name
        }
      }
    `,
  };
  let wrapper: ReactWrapper;

  beforeEach(() => {
    wrapper = mount(
      <ToastProvider>
        <MockedProvider>
          <Router>
            <Modal {...props} />
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
  it('component is defined', () => {
    const button = wrapper.find(AsyncButton);
    button.simulate('click');
    expect(wrapper).toBeDefined();
  });
});
