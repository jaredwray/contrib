import { mount, ReactWrapper } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import { AuthProvider } from 'src/components/helpers/AuthProvider/AuthProvider';

const props = {
  children: <></>,
  apiUrl: 'testUrl',
};

describe('AuthProvider', () => {
  let wrapper: ReactWrapper;

  beforeEach(async () => {
    global.fetch = () =>
      Promise.resolve({
        json: () => Promise.resolve({ user: { id: 'testId' } }),
      });

    await act(async () => {
      wrapper = mount(
        <MemoryRouter initialEntries={[`/`]}>
          <AuthProvider {...props} />;
        </MemoryRouter>,
      );

      await new Promise((resolve) => setTimeout(resolve));
      wrapper!.update();
    });
  });

  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
