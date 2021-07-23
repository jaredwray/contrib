import { BrowserRouter as Router } from 'react-router-dom';
import { StopOrActiveButton } from '../StopOrActiveButton';
import { auction } from 'src/helpers/testHelpers/auction';
import { mount } from 'enzyme';
import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';
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
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    const wrapper = mount(
      <ToastProvider>
        <MockedProvider>
          <Router>
            <StopOrActiveButton {...props} />
          </Router>
        </MockedProvider>
      </ToastProvider>,
    );
    expect(wrapper).toHaveLength(1);
  });
  it('it should open Modal when clicking', () => {
    const wrapper = mount(
      <ToastProvider>
        <MockedProvider>
          <Router>
            <StopOrActiveButton {...props} />
          </Router>
        </MockedProvider>
      </ToastProvider>,
    );
    wrapper.children().find('Button').simulate('click');
  });
  it('it should close Modal when clicking', () => {
    const wrapper = mount(
      <ToastProvider>
        <MockedProvider>
          <Router>
            <StopOrActiveButton {...props} />
          </Router>
        </MockedProvider>
      </ToastProvider>,
    );
    wrapper.children().find('Button').simulate('click');
    expect(wrapper.find('DialogContent').text()).toEqual('Do you want to stop an auction: test?');
  });
  it('when auction is settled and stopped it should change modal text', () => {
    const wrapper = mount(
      <ToastProvider>
        <MockedProvider>
          <Router>
            <StopOrActiveButton {...{ ...props, auction: { ...props.auction, isFailed: false, isStopped: true } }} />
          </Router>
        </MockedProvider>
      </ToastProvider>,
    );
    wrapper.children().find('Button').simulate('click');
    expect(wrapper.find('DialogContent').text()).toEqual(
      'The auction test has been expired on May 31 2021,so it will be changed to SETTLED.Change the end date before submitting if you want to make it ACTIVE',
    );
  });
  it('when auction is stopped and not settled it should change modal text', () => {
    jest.useFakeTimers('modern').setSystemTime(new Date('2021-01-05'));
    const wrapper = mount(
      <ToastProvider>
        <MockedProvider>
          <Router>
            <StopOrActiveButton {...{ ...props, auction: { ...props.auction, isFailed: false, isStopped: true } }} />
          </Router>
        </MockedProvider>
      </ToastProvider>,
    );
    wrapper.children().find('Button').simulate('click');
    expect(wrapper.find('DialogContent').text()).toEqual(
      'Do you want to activate an auction: test?It will end on May 31 2021',
    );
  });
});
