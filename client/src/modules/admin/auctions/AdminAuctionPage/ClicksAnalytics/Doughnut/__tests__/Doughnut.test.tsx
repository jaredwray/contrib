import { ChartDoughnut } from 'src/modules/admin/auctions/AdminAuctionPage/ClicksAnalytics/Doughnut';

import { shallow, mount, ShallowWrapper, ReactWrapper } from 'enzyme';

import { MockedProvider } from '@apollo/client/testing';

describe('Should render correctly "ChartDoughnut"', () => {
  const props: any = {
    labels: [],
    values: [],
  };
  let wrapper: ShallowWrapper;
  beforeEach(() => {
    wrapper = shallow(
      <MockedProvider>
        <ChartDoughnut {...props} />
      </MockedProvider>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
