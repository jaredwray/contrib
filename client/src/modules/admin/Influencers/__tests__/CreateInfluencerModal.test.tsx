import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { ToastProvider } from 'react-toast-notifications';
import { BrowserRouter as Router } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';

import Form from 'src/components/Form/Form';
import { CreateInfluencerModal } from 'src/modules/admin/Influencers/CreateInfluencer/CreateInfluencerModal';
import { CreateInfluencerMutation } from 'src/apollo/queries/influencers';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

describe('Should render correctly "CreateInfluencerModal"', () => {
  const props: any = {
    open: true,
    onClose: jest.fn(),
  };

  const mockFn = jest.fn();

  const mocks = [
    {
      request: {
        query: CreateInfluencerMutation,
        variables: { name: 'test' },
      },
      newData: () => {
        mockFn();
        return {
          data: {
            deleteAuction: {
              id: 'test',
            },
          },
        };
      },
    },
  ];
  afterEach(() => {
    jest.clearAllMocks();
  });
  const wrapper = mount(
    <ToastProvider>
      <MockedProvider>
        <Router>
          <CreateInfluencerModal {...props} />
        </Router>
      </MockedProvider>
    </ToastProvider>,
  );
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
  it('should close modal', () => {
    wrapper.simulate('click');
    expect(props.onClose).toBeCalledTimes(1);
  });

  it('should call mutation', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <MockedProvider mocks={mocks}>
            <Router>
              <CreateInfluencerModal {...props} />
            </Router>
          </MockedProvider>
        </ToastProvider>,
      );
      wrapper.find(Form).props().onSubmit({ name: 'test' });

      await new Promise((resolve) => setTimeout(resolve));

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
