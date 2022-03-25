import { ToastProvider } from 'react-toast-notifications';
import { MockedProvider } from '@apollo/client/testing';
import Form from 'src/components/forms/Form/Form';
import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { BasicFormFields } from '../BasicFormFields';
import { influencer } from 'src/helpers/testHelpers/influencer';

describe('BasicFormFields', () => {
  it('renders component', async () => {
    let wrapper: ReactWrapper;

    await act(async () => {
      wrapper = mount(
        <MockedProvider>
          <ToastProvider>
            <Form onSubmit={jest.fn}>
              <BasicFormFields influencer={influencer} />
            </Form>
          </ToastProvider>
        </MockedProvider>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });

    expect(wrapper).toHaveLength(1);
  });
});
