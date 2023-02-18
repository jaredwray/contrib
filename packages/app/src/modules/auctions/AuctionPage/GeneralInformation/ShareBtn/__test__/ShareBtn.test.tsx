import { mount, ReactWrapper } from 'enzyme';
import { ToastProvider } from 'react-toast-notifications';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import ShareBtn from '..';

const props: any = {
  link: 'link',
};
describe('ShareBtn', () => {
  it('renders without crashing', () => {
    let wrapper: ReactWrapper = mount(
      <ToastProvider>
        <ShareBtn {...props} />
      </ToastProvider>,
    );

    expect(wrapper.find(CopyToClipboard)).toHaveLength(2);
    wrapper.find(CopyToClipboard).first().props().onCopy('link', true);
  });
});
