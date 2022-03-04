import { act } from '@testing-library/react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

import Benefits from '../GeneralInformation/Benefits';

const defaultProps: any = {
  id: '123',
  name: 'test',
  status: 'status',
};

describe('Benefits', () => {
  describe('with default arguments', () => {
    it('renders without crashing', () => {
      const wrapper = mount(
        <Router>
          <Benefits {...defaultProps} />
        </Router>,
      );
      expect(wrapper).toHaveLength(1);
    });
  });
  describe('with all arguments', () => {
    it('renders without crashing', () => {
      const props = {
        ...defaultProps,
        avatarUrl: '/test/url',
      };
      const wrapper = mount(
        <Router>
          <Benefits {...props} />
        </Router>,
      );
      expect(wrapper).toHaveLength(1);
    });
  });
});
