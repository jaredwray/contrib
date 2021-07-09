import { mount, ReactWrapper } from 'enzyme';

import { ContribApolloProvider } from '..';
describe('Should render correctly "ContribApolloProvider"', () => {
  const Component = () => <div>Component</div>;

  let wrapper: ReactWrapper;
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
