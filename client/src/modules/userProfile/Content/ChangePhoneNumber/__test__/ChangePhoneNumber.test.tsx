import { act } from 'react-dom/test-utils';
import { ReactWrapper, mount } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import { Button } from 'react-bootstrap';

import ChangePhoneNumber from '../index';

describe('Should render correctly "ChangePhoneNumber"', () => {
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
          <ChangePhoneNumber {...props} />
        </MockedProvider>,
      );
    });
  });

  it('component is defined', async () => {
    expect(wrapper!).toHaveLength(1);
  });

  describe('after click on "Change Number" button', () => {
    it('should call setShowDialog', async () => {
      wrapper!.find(Button).simulate('click');

      expect(mockedSetShowDialog).toBeCalledTimes(1);
    });
  });
});
