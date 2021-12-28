import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ToggleButton } from 'react-bootstrap';

import { metrics, blankMetrics, shortMetrics } from 'src/helpers/testHelpers/metrics';
import { ClicksAnalytics } from '../index';

jest.mock('../Doughnut', () => ({
  ChartDoughnut: () => 'ChartDoughnut',
}));
jest.mock('react-chartjs-2', () => ({
  Bar: () => 'Bar',
}));

describe('ClicksAnalytics', () => {
  describe('with metrics', () => {
    it('renders metrics', async () => {
      const wrapper = mount(<ClicksAnalytics metrics={metrics} />);
      expect(wrapper).toHaveLength(1);
      act(() => {
        wrapper!
          .find(ToggleButton)
          .last()
          .props()
          .onChange({ currentTarget: { value: 1 } });
        wrapper!
          .find(ToggleButton)
          .first()
          .props()
          .onChange({ currentTarget: { value: 0 } });
      });
    });
  });

  describe('with short metrics data', () => {
    it('renders metrics', async () => {
      const wrapper = mount(<ClicksAnalytics metrics={shortMetrics} />);
      expect(wrapper).toHaveLength(1);
      act(() => {
        wrapper!
          .find(ToggleButton)
          .last()
          .props()
          .onChange({ currentTarget: { value: 1 } });
        wrapper!
          .find(ToggleButton)
          .first()
          .props()
          .onChange({ currentTarget: { value: 0 } });
      });
    });
  });

  describe('without metrics', () => {
    it('renders message', async () => {
      const wrapper = mount(<ClicksAnalytics metrics={blankMetrics} />);
      expect(wrapper).toHaveLength(1);
      expect(wrapper.text()).toEqual('No information yet');
    });
  });

  describe('for AuctionPage', () => {
    it('renders metrics', () => {
      const wrapper = mount(<ClicksAnalytics metrics={metrics} isAuctionPage={true} />);
      expect(wrapper).toHaveLength(1);
    });

    describe('without metrics', () => {
      it('renders message', async () => {
        const wrapper = mount(<ClicksAnalytics metrics={blankMetrics} isAuctionPage={true} />);
        expect(wrapper).toHaveLength(1);
        expect(wrapper.text()).toEqual('No information yet');
      });
    });
  });
});
