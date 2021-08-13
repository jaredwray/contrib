import NewAuctionBasicPage from '../BasicPage/New';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';
import { BrowserRouter as Router } from 'react-router-dom';
import StepByStepRow from 'src/components/StepByStepRow';

import Form from 'src/components/Form/Form';
import { CreateAuctionMutation } from 'src/apollo/queries/auctions';

const mockHistoryFn = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryFn,
  }),
}));
describe('Should render correctly "NewAuctionBasicPage"', () => {
  const mockFn = jest.fn();

  const mocks = [
    {
      request: {
        query: CreateAuctionMutation,
        variables: {
          title: 'test',
          sport: 'test',
        },
      },
      newData: () => {
        mockFn();
        return {
          data: {
            createAuction: {
              id: 'testId',
              description: 'test',
              fullPageDescription: 'test',
              gameWorn: false,
              autographed: false,
              playedIn: 'test',
              title: 'test',
              sport: 'test',
              authenticityCertificate: false,
              link: 'test',
            },
          },
        };
      },
    },
  ];

  it('component is defined', () => {
    const wrapper = mount(
      <ToastProvider>
        <MockedProvider>
          <Router>
            <NewAuctionBasicPage />
          </Router>
        </MockedProvider>
      </ToastProvider>,
    );
    expect(wrapper).toHaveLength(1);
  });
  it('should call history.push when clicking on the prev button ', () => {
    const wrapper = mount(
      <ToastProvider>
        <MockedProvider>
          <Router>
            <NewAuctionBasicPage />
          </Router>
        </MockedProvider>
      </ToastProvider>,
    );
    wrapper.find(StepByStepRow).children().find('Button').at(0).simulate('click');
    expect(mockHistoryFn).toHaveBeenCalledTimes(1);
  });

  it('should call mutation and history.push', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <ToastProvider>
          <MockedProvider mocks={mocks}>
            <Router>
              <NewAuctionBasicPage />
            </Router>
          </MockedProvider>
        </ToastProvider>,
      );
      wrapper.find(Form).props().onSubmit({
        sport: 'test',
        title: 'test',
      });

      expect(mockFn).toHaveBeenCalledTimes(1);

      await new Promise((resolve) => setTimeout(resolve));
      expect(mockHistoryFn).toHaveBeenCalledTimes(1);
    });
  });
});
