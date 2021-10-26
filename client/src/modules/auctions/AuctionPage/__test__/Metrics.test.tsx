import { mount } from 'enzyme';

import Metrics from '../Metrics';

import { metrics } from 'src/helpers/testHelpers/metrics';

const requestMetrics = jest.fn();

const props = {
  metrics,
  requestMetrics,
};

const nullMetricsProps = {
  metrics: null,
  requestMetrics,
};

describe('Metrics', () => {
  it('component should be defined', async () => {
    const wrapper = mount(<Metrics {...props} />);

    expect(wrapper).toHaveLength(1);
  });

  it('component should contain Loading', async () => {
    const wrapper = mount(<Metrics {...nullMetricsProps} />);

    const button = wrapper.find('Button').first();

    button.simulate('click');

    wrapper.update();

    expect(wrapper.find('Loading')).toHaveLength(1);
  });
});
