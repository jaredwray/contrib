import { mount, ReactWrapper } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { MockedProvider } from '@apollo/client/testing';
import Pagination from '../../../custom/Pagination';

import { AdminPage } from '..';
describe('Should render correctly "AdminPage"', () => {
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
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('should call setPageSkip', () => {
    wrapper.find(Pagination).props().showNextPage();
    wrapper.find(Pagination).props().showPrevPage();
    expect(props.setPageSkip).toHaveBeenCalledTimes(2);
  });
});
