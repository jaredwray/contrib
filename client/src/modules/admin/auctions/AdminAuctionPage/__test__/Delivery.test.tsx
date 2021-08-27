import { mount } from 'enzyme';
import { auctionForAdminPage } from 'src/helpers/testHelpers/auction';
import { Delivery } from '../Delivery';
describe('Should render correctly "Details"', () => {
  const props: any = {
    auction: auctionForAdminPage,
  };
  it('component is defined', () => {
    const wrapper = mount(<Delivery {...props} />);
    expect(wrapper).toHaveLength(1);
  });
});
