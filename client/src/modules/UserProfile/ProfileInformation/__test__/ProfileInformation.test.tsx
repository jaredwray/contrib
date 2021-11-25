import { act } from 'react-dom/test-utils';
import { ReactWrapper, mount } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import { Button } from 'react-bootstrap';

import ProfileInformation from '../index';

describe('ProfileInformation', () => {
  const mockedSetShowDialog = jest.fn();

  const props: any = {
    currentPhoneNumber: '+22222222222',
    setShowDialog: mockedSetShowDialog,
  };

  let wrapper: ReactWrapper;

  beforeEach(async () => {
    await act(async () => {
      wrapper = mount(
        <MockedProvider>
          <ProfileInformation {...props} />
        </MockedProvider>,
      );
    });
  });

  it('component is defined', async () => {
    expect(wrapper!).toHaveLength(1);
  });
});
