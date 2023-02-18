import { mount, ReactWrapper } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { MockedProvider } from '@apollo/client/testing';
import Pagination from '../../../custom/Pagination';
import { AdminPage } from '..';

describe('AdminPage', () => {
  const props: any = {
    items: [{}, {}],
    pageSkip: 20,
    setPageSkip: jest.fn(),
    loading: false,
  };

  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <Router>
        <ToastProvider>
          <MockedProvider>
            <AdminPage {...props} />
          </MockedProvider>
        </ToastProvider>
      </Router>,
    );
  });

  it('renders without errors', () => {
    expect(wrapper).toHaveLength(1);
  });
});
