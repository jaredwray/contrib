import { shallow, mount } from 'enzyme';
import { gql } from '@apollo/client';
import { ToastProvider } from 'react-toast-notifications';
import { MockedProvider } from '@apollo/client/testing';
import { AvatarPicker } from 'src/components/AvatarPicker';

describe('Should render correctly "AvatarPicker"', () => {
  const props: any = {
    item: {
      avatarUrl: 'test',
      favoriteCharities: [],
      id: 'test',
      name: 'test',
      profileDescription: 'test',
      sport: 'test',
      status: 'test',
      team: 'test',
    },
    updateMutation: gql`
      mutation test($name: String!) {
        test(name: $name) {
          name
        }
      }
    `,
    itemId: 'test',
  };

  let wrapper: any;
  beforeEach(() => {
    wrapper = mount(
      <ToastProvider>
        <MockedProvider mocks={[]}>
          <AvatarPicker {...props} />
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
});
