import { mount, ReactWrapper } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import Form from 'src/components/Form/Form';
import { InfluencerOnboardingNavigation } from '../InfluencerOnboardingNavigation';
const mockedSumbit = jest.fn();
describe('Should render correctly "InfluencerOnboardingNavigation"', () => {
  let wrapper: ReactWrapper;
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    wrapper = mount(
      <MemoryRouter initialEntries={[`/`]}>
        <Form onSubmit={mockedSumbit}>
          <InfluencerOnboardingNavigation step="basic" />
        </Form>
      </MemoryRouter>,
    );
    expect(wrapper).toHaveLength(1);
  });
  it('component is defined', () => {
    wrapper = mount(
      <MemoryRouter initialEntries={[`/`]}>
        <Form onSubmit={mockedSumbit}>
          <InfluencerOnboardingNavigation step="charities" />
        </Form>
      </MemoryRouter>,
    );
    expect(wrapper).toHaveLength(1);
  });
});
