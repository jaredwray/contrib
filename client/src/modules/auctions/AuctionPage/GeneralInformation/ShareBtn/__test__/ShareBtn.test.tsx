import { mount, ReactWrapper } from 'enzyme';
import { ToastProvider } from 'react-toast-notifications';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import ShareBtn from '..';

const props: any = {
  link: 'link',
};

xit('renders without crashing', () => {
  let wrapper: ReactWrapper = mount(
    <ToastProvider>
      <ShareBtn {...props} />
    </ToastProvider>,
  );

  wrapper.find(CopyToClipboard).props().onCopy('hello world', true);
});
