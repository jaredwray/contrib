import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom';
import { auction } from 'src/helpers/testHelpers/auction';
import { ToastProvider } from 'react-toast-notifications';

import AuctionCard from '..';

describe('Should render correctly "AuctionCard"', () => {
  const props: any = {
    auction,
  };
  let wrapper: ReactWrapper;
  jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());

  beforeEach(() => {
    wrapper = mount(
      <MockedProvider mocks={[]}>
        <ToastProvider>
          <Router>
            <AuctionCard {...props} />
          </Router>
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
