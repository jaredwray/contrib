import { mount, shallow, ShallowWrapper } from 'enzyme';

import CharitiesFormFields from '..';

describe('CharitiesFormFields', () => {
  it('component is defined', () => {
    expect(shallow(<CharitiesFormFields />)).toHaveLength(1);
  });
});
