import ReactDOM from 'react-dom';
import { App } from './index';

jest.mock('react-dom', () => ({ render: jest.fn() }));

describe('App', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    global.document.getElementById = (elementId): any => elementId === 'root' && div;
    expect(ReactDOM.render).toHaveBeenCalledWith(<App />, div);
  });
});
