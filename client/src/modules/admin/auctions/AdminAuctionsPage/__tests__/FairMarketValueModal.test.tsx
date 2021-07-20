import { Modal } from '../FairMarketValueChangeButton/Modal';
import { auction } from 'src/helpers/testHelpers/auction';
import { BrowserRouter as Router } from 'react-router-dom';
import { mount, ReactWrapper } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';
import Form from 'src/components/Form/Form';
import { act } from 'react-dom/test-utils';
import { gql } from '@apollo/client';

describe('Should render correctly "Modal"', () => {
  const props: any = {
    open: true,
    onClose: jest.fn(),
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

  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('should submit the form', async () => {
    await act(async () => {
      wrapper.find(Form).props().onSubmit({ amount: 200, currency: 'USD', precision: 2 });
    });
  });
});
