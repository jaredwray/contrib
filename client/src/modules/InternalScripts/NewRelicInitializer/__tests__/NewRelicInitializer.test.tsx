import { mount, ReactWrapper } from 'enzyme';

import NewRelicInitializer from '../index';

describe('NewRelicInitializer', () => {
  let wrapper: ReactWrapper;
  const OLD_ENV = process.env;
  global.NREUM = jest.fn();

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env = OLD_ENV;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('without defined REACT_APP_USE_NEWRELIC', () => {
    it('renders without errors', () => {
      process.env.REACT_APP_USE_NEWRELIC = null;
      wrapper = mount(<NewRelicInitializer />);
      expect(wrapper).toHaveLength(1);
    });
  });
  describe('when REACT_APP_USE_NEWRELIC=true', () => {
    beforeEach(() => {
      process.env.REACT_APP_USE_NEWRELIC = 'true';
    });

    describe('without defined REACT_APP_PLATFORM_URL', () => {
      it('renders without errors', () => {
        process.env.REACT_APP_PLATFORM_URL = null;
        wrapper = mount(<NewRelicInitializer />);
        expect(wrapper).toHaveLength(1);
      });
    });

    describe('with defined REACT_APP_PLATFORM_URL', () => {
      it('renders without errors', () => {
        process.env.REACT_APP_PLATFORM_URL = 'https://dev.contrib.org/';
        wrapper = mount(<NewRelicInitializer />);
        expect(wrapper).toHaveLength(1);
      });
    });

    describe('when defined REACT_APP_PLATFORM_URL is not suported', () => {
      it('renders without errors', () => {
        process.env.REACT_APP_PLATFORM_URL = 'http://localhost:3000/';
        wrapper = mount(<NewRelicInitializer />);
        expect(wrapper).toHaveLength(1);
      });
    });
  });
});
