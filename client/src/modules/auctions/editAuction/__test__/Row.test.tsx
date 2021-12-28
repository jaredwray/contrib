import { mount } from 'enzyme';

import Row from '../common/Row';

describe('Row', () => {
  describe('with default params', () => {
    it('renders component', () => {
      const wrapper = mount(<Row description="description">{<>test</>}</Row>);
      expect(wrapper!).toHaveLength(1);
    });
  });
  describe('with all params', () => {
    it('renders component', () => {
      const wrapper = mount(
        <Row description="description" title="title" childrenWrapperClassName="pb-0">
          {<>test</>}
        </Row>,
      );
      expect(wrapper!).toHaveLength(1);
    });
  });
});
