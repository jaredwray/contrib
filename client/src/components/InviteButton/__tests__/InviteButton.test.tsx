import { gql } from '@apollo/client';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';

import { InviteButton } from '..';
import { Modal } from '../Modal';

describe('Should render correctly "InviteButton"', () => {
  const props: any = {
    mutation: gql`
      mutation test($name: String!) {
        test(name: $name) {
          name
        }
      }
    `,
  };
  const mockFn = jest.fn();
  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <ToastProvider>
        <MockedProvider mocks={[]}>
          <InviteButton {...props} />
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
  it('it should open and close Modal when clicking', () => {
    wrapper.children().find('Button').simulate('click');
    expect(wrapper.find('Dialog')).toHaveLength(1);
    act(() => {
      wrapper.children().find(Modal).props().onClose();
    });
  });
});
