import { mount } from 'enzyme';
import { auctionForAdminPage } from 'src/helpers/testHelpers/auction';
import { Delivery } from '../Delivery';
describe('Should render correctly "Details"', () => {
  const props: any = {
    auction: auctionForAdminPage,
  };
  const propsWithoutWinner: any = {
    auction: { ...props.aution, winner: null },
  };

  it('component  should return "no winner for this auction ', () => {
    const wrapper = mount(<Delivery {...propsWithoutWinner} />);
    expect(wrapper.text()).toEqual("no delivery for this auction");
  });
  it('component is defined', () => {
    const wrapper = mount(<Delivery {...props} />);
    expect(wrapper).toHaveLength(1);
  });
});
