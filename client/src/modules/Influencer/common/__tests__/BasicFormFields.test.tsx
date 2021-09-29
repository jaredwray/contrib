import { ToastProvider } from 'react-toast-notifications';
import { MockedProvider } from '@apollo/client/testing';
import Form from 'src/components/forms/Form/Form';
import { mount, ReactWrapper } from 'enzyme';
import { BasicFormFields } from '../BasicFormFields';
import { influencer } from 'src/helpers/testHelpers/influencer';


const mockedSumbit = jest.fn();

describe('Should render correctly ', () => {
  const props: any = {
    influencer: influencer,
  };

  let wrapper: ReactWrapper;
  beforeEach(() => {
    wrapper = mount(
      <MockedProvider>
        <ToastProvider>
          <Form onSubmit={mockedSumbit}>
            <BasicFormFields {...props} />
          </Form>
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
