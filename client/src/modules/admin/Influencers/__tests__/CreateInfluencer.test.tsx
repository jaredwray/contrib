import { mount, ReactWrapper } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom';

import { CreateInfluencer } from '../CreateInfluencer';
import { CreateInfluencerModal } from 'src/modules/admin/Influencers/CreateInfluencer/CreateInfluencerModal';

describe('Should render correctly "CreateInfluencer"', () => {
  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <MockedProvider>
        <Router>
          <CreateInfluencer />
        </Router>
      </MockedProvider>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('it should open Modal when clicking', () => {
    wrapper.children().find('Button').simulate('click');
  });
  it('it should close Modal when clicking', () => {
    wrapper.children().find('Button').simulate('click');
    wrapper.children().find(CreateInfluencerModal).children().find('.close').simulate('click');
  });
});
