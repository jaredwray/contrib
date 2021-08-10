import { mount, ReactWrapper } from 'enzyme';

import { ContribApolloProvider } from '..';
describe('Should render correctly "ContribApolloProvider"', () => {
  const Component = () => <div>Component</div>;

  let wrapper: ReactWrapper;
  beforeAll(() => {
    process.env = { ...process.env, REACT_APP_API_URL: 'https://dev.contrib.org/graphql' };
  });
  beforeEach(() => {
    wrapper = mount(
      <ContribApolloProvider>
        <Component />
      </ContribApolloProvider>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
