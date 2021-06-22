import { mount, ReactWrapper } from 'enzyme';
import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { InviteButton } from '..';

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
      <MockedProvider mocks={[]}>
        <InviteButton {...props} />
      </MockedProvider>,
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
    expect(wrapper.find('Dialog')).toHaveLength(1);
  });
});
