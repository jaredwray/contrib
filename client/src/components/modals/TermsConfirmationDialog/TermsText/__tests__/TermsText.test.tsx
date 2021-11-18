import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';

import TermsText from '..';

describe('TermsConfirmationDialog', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders terms', async () => {
    await act(async () => {
      global.fetch = jest.fn(async () => ({
        text: async () => 'test text',
      }));
      wrapper = mount(<TermsText />);
    });
    expect(wrapper.text().includes('test text')).toBe(true);
  });
});
