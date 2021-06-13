import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { UserAccountProvider } from 'src/components/UserAccountProvider/UserAccountProvider';
const props = {
  children: <></>,
};
describe('Should render correctly "UserAccountProvider"', () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter initialEntries={[`/`]}>
        <UserAccountProvider {...props} />;
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
