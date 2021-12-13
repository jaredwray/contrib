import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import LoginPage from '..';

const mockHistoryBack = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    back: mockHistoryBack,
  }),
}));

describe('LoginPage', () => {
  it('component defined', async () => {
    let wrapper: ReactWrapper;

    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <MemoryRouter initialEntries={['/invitation/fake-slug']}>
            <MockedProvider>
              <LoginPage />
            </MockedProvider>
          </MemoryRouter>
        </ToastProvider>,
      );
    });
    expect(wrapper!.find(LoginPage)).toHaveLength(1);
  });
});
