import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom';
import { auction } from 'src/helpers/testHelpers/auction';
import { ToastProvider } from 'react-toast-notifications';
import { CloseButton } from 'src/components/CloseButton';
import { Modal } from 'src/components/AdminAuctionsPageModal';
import AuctionCard from '..';
const props: any = {
  auction,
};
const emptyProps: any = {};
const newProps: any = {
  auction: {
    ...props.auction,
    currentPrice: null,
    isDraft: true,
    isFailed: false,
  },
};
describe('Should render correctly "AuctionCard"', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());

  it('component return null', () => {
    const wrapper = mount(
      <MockedProvider>
        <ToastProvider>
          <Router>
            <AuctionCard {...emptyProps} />
          </Router>
        </ToastProvider>
      </MockedProvider>,
    );
    expect(wrapper.find('figure')).toHaveLength(0);
    wrapper.unmount();
  });
  it('component is defined', () => {
    const wrapper = mount(
      <MockedProvider>
        <ToastProvider>
          <Router>
            <AuctionCard {...props} />
          </Router>
        </ToastProvider>
      </MockedProvider>,
    );

    expect(wrapper.find('figure')).toHaveLength(1);
    wrapper.unmount();
  });
  it('component is defined and has CloseButton,which should open modal when clicking', () => {
    const wrapper = mount(
      <MockedProvider>
        <ToastProvider>
          <Router>
            <AuctionCard {...newProps} />
          </Router>
        </ToastProvider>
      </MockedProvider>,
    );
    expect(wrapper.find(CloseButton)).toHaveLength(1);
    wrapper.children().find(CloseButton).simulate('click');
    wrapper.children().find(Modal).children().find('Button').first().simulate('click');
  });
});
