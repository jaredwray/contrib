import { mount, ReactWrapper } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from 'src/components/helpers/AuthProvider/AuthProvider';
const props = {
  children: <></>,
  apiUrl: 'testUrl',
};

describe('AuthProvider', () => {
  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter initialEntries={[`/`]}>
        <AuthProvider {...props} />;
      </MemoryRouter>,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
