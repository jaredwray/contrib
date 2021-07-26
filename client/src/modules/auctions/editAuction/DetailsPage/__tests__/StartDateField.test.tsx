import { mount, ReactWrapper } from 'enzyme';
import StartDateField from '../StartDateField';
import Form from 'src/components/Form/Form';
import { ToastProvider } from 'react-toast-notifications';

jest.mock('react-datepicker', () => () => <></>);
jest.mock('react-final-form', () => ({
  ...jest.requireActual('react-final-form'),
  useFormState: () => ({
    values: {
      charity: null,
      duration: '1',
      itemPrice: { amount: 0, currency: 'USD', precision: 2 },
      startDate: { date: new Date('2021-01-01T01:00:00Z'), time: '1:00', timeZone: 'America/Los_Angeles' },
      startPrice: { amount: 100, currency: 'USD', precision: 2 },
    },
  }),
}));
describe('Should render correctly "StartDateField"', () => {
  const props: any = {
    name: 'startDate',
  };
  const mockFn = jest.fn();

  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <Form onSubmit={mockFn}>
        <StartDateField {...props} />
      </Form>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('it should add 0 before new time value', () => {
    wrapper.find('input[name="startDate.time"]').simulate('change', { target: { value: '8:00' } });
    expect(wrapper.find('input[name="startDate.time"]').prop('defaultValue')).toBe('08:00');
  });
});
