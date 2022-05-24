import { shallow, ShallowWrapper } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

import Pagination from 'src/components/custom/Pagination';

describe('Should render correctly "Pagination"', () => {
  const props: any = {
    loading: false,
    total: 50,
  };
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = shallow(
      <Router>
        <Pagination {...props} />
      </Router>,
    );
  });

  it('renders without errors', () => {
    expect(wrapper).toHaveLength(1);
  });
});
