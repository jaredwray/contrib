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

  it('component is defined', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MockedProvider>
          <ChangePhoneNumber {...props} />
        </MockedProvider>,
      );
    });
    expect(wrapper!).toHaveLength(1);
  });

  it('should call setShowDialog', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MockedProvider>
          <ChangePhoneNumber {...props} />
        </MockedProvider>,
      );
    });

    wrapper!.find(Button).simulate('click');
    expect(mockedSetShowDialog).toBeCalledTimes(1);
  });
});
