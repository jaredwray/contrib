import { MyAccountQuery } from 'src/apollo/queries/accountQuery';
import { UserAccountStatus } from 'src/types/UserAccount';
import PhoneNumberConfirmation from '../Confirmation';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import { InMemoryCache } from '@apollo/client';
import Layout from '../Layout';
import { act } from 'react-dom/test-utils';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const cache = new InMemoryCache();

cache.writeQuery({
  query: MyAccountQuery,
  data: {
    myAccount: {
      id: '123',
      phoneNumber: '123',
      status: UserAccountStatus.PHONE_NUMBER_CONFIRMATION_REQUIRED,
      influencerProfile: null,
      isAdmin: false,
      createdAt: '2021-02-18T14:36:35.208+00:00',
      notAcceptedTerms: null,
      assistant: null,
      paymentInformation: null,
      mongodbId: '321',
      charity: null,
      address: {
        name: 'test name',
        state: 'test state',
        city: 'test city',
        zipCode: 'test zipCode',
        country: 'test country',
        street: 'test street',
      },
    },
  },
});
describe('AuctionPage ', () => {
  it('component return null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MockedProvider>
          <PhoneNumberConfirmation />
        </MockedProvider>,
      );
    });
    expect(wrapper!.find(Layout)).toHaveLength(0);
  });
  it('component is defined and has Layout', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MockedProvider cache={cache}>
          <PhoneNumberConfirmation />
        </MockedProvider>,
      );
      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();
    });
    expect(wrapper!).toHaveLength(1);
    expect(wrapper!.find(Layout)).toHaveLength(1);
  });
});
