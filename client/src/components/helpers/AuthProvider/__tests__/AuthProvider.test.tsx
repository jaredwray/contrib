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

  it('test', async () => {
    // const a: any = {
    //   json: jest.fn().mockResolvedValue({}),
    // };
    // jest.spyOn(global, 'fetch').mockResolvedValue(a);

    await new Promise((resolve) => setTimeout(resolve));
    wrapper.update();
  });
});
