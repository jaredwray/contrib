import { useScript } from '../useScript';
import { mount } from 'enzyme';

const TestHook = (props: { callback: Function }) => {
  const { callback } = props;
  callback();
  return null;
};

const testHook = (callback: any) => {
  mount(<TestHook callback={callback} />);
};
const testComponent = <>test</>;
let variable: any;
beforeEach(() => {
  testHook(() => {
    variable = useScript('test');
  });
});
describe('useScript', () => {
  test('', () => {
    const wrapper = mount(testComponent);
    expect(wrapper.render().toString()).toEqual('test');
  });
});
