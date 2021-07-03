import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
import { shallow, mount, render, ShallowWrapper, ReactWrapper } from 'enzyme';
import Form from 'src/components/Form/Form';
import { FavouriteCharitiesField } from '../FavouriteCharitiesField';
import useField from 'src/components/Form/hooks/useField';
import { MockedProvider } from '@apollo/client/testing';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);
jest.mock('src/components/Form/hooks/useField', () => () => {
  return {
    name: 'favoriteCharities',
    hasError: false,
    checked: undefined,
    disabled: false,
    errorMessage: null,
    onBlur: jest.fn(),
    onChange: jest.fn(),
    onFocus: jest.fn(),
    value: [
      {
        id: '60c1f579ff49a51d6f2ee61b',
        name: 'My Active Charity Name',
        profileStatus: 'COMPLETED',
        status: 'ACTIVE',
        stripeStatus: 'ACTIVE',
      },
    ],
  };
});

describe('Should render correctly', () => {
  let wrapper: ReactWrapper;

  const props = {
    name: 'My Active Charity Name',
  };
  beforeEach(async () => {
    await act(async () => {
      wrapper = mount(
        <MockedProvider>
          <Form onSubmit={jest.fn()}>
            <FavouriteCharitiesField {...props} />
          </Form>
        </MockedProvider>,
      );
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('component is defined', () => {
    expect(wrapper).toHaveLength(1);
  });
});
