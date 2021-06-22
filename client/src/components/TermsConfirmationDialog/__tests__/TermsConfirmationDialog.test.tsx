import { mount, ReactWrapper } from 'enzyme';
import { ToastProvider } from 'react-toast-notifications';
import TermsConfirmationDialog from 'src/components/TermsConfirmationDialog';
import { MockedProvider } from '@apollo/client/testing';

describe('Should render correctly "TermsConfirmationDialog"', () => {
  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <MockedProvider mocks={[]}>
        <ToastProvider>
          <TermsConfirmationDialog />
        </ToastProvider>
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
