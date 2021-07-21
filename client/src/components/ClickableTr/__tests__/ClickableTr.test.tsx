import { mount, ReactWrapper } from 'enzyme';
import ClickableTr from 'src/components/ClickableTr';

const mockHistoryFn = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryFn,
  }),
  useRouteMatch: () => ({ url: '/auctions/testId' }),
}));

describe('Should render correctly "ClickableTr"', () => {
  const props: any = {
    children: <td>test</td>,
    linkTo: '/test',
  };
  const mockFn = { push: jest.fn() };

  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <table>
        <tbody>
          <ClickableTr {...props} history={mockFn} />
        </tbody>
      </table>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('should call push when clicking', () => {
    wrapper.find('tr').simulate('mousedown');
    wrapper.find('tr').simulate('click');
    expect(mockHistoryFn).toHaveBeenCalledTimes(1);
  });
});
