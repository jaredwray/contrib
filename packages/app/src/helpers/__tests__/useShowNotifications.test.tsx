import { act } from 'react-dom/test-utils';
import { useShowNotification } from '../useShowNotification';
import { ToastProvider } from 'react-toast-notifications';
import { mount } from 'enzyme';

const TestHook = (props: { callback: Function }) => {
  const { callback } = props;
  callback();
  return null;
};

const testHook = (callback: any) => {
  mount(
    <ToastProvider>
      <TestHook callback={callback} />
    </ToastProvider>,
  );
};
let variable: any;
beforeEach(() => {
  testHook(() => {
    variable = useShowNotification();
  });
});
describe('useShowNotification', () => {
  test('should have functions', () => {
    expect(variable.showMessage).toBeInstanceOf(Function);
    expect(variable.showError).toBeInstanceOf(Function);
    expect(variable.showWarning).toBeInstanceOf(Function);
  });
  test('it should call functions', () => {
    act(() => {
      variable.showMessage('test');
    });
    act(() => {
      variable.showError('test');
    });
    act(() => {
      variable.showWarning('test');
    });
  });
});
