import { render } from '@testing-library/react';

import { ChartDoughnut } from 'src/components/Doughnut';

import { shallow, mount, ShallowWrapper, ReactWrapper } from 'enzyme';

import { ToastProvider } from 'react-toast-notifications';
import { MockedProvider } from '@apollo/client/testing';

describe('Should render correctly "ChartDoughnut"', () => {
  const props: any = {
    labels: [],
    values: [],
  };
  let wrapper: ShallowWrapper;
  beforeEach(() => {
    wrapper = shallow(
      <MockedProvider>
        <ChartDoughnut {...props} />
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
