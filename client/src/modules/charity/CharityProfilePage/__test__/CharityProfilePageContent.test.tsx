import { mount } from 'enzyme';
import { DineroObject } from 'dinero.js';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { ToastProvider } from 'react-toast-notifications';

import Layout from 'src/components/Layout';
import { ContribApolloProvider } from 'src/apollo/ContribApolloProvider';
import { CharityProfilePageContent } from '../CharityProfilePageContent';

jest.mock('src/components/TermsConfirmationDialog', () => () => <></>);
const props: any = {
  charity: {
    avatarUrl: 'test',
    followers: [{ createdAt: '2021-06-21T17:11:07.220Z', user: 'test' }],
    id: 'test',
    name: '123',
    profileDescription: '123',
    status: 'ACTIVE',
    website: '123',
    websiteUrl: 'http://123',
  },
  totalRaisedAmount: {} as DineroObject,
};
const newProps: any = {
  ...props,
  charity: {
    ...props.charity,
    status: 'INACTIVE',
  },
};
describe('Should render correctly "CharityProfilePageContent"', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('component return null', () => {
    const wrapper = mount(
      <ContribApolloProvider>
        <ToastProvider>
          <MockedProvider>
            <MemoryRouter>
              <CharityProfilePageContent {...newProps} />
            </MemoryRouter>
          </MockedProvider>
        </ToastProvider>
      </ContribApolloProvider>,
    );
    expect(wrapper.find(Layout)).toHaveLength(0);
  });
  it('component is defined', () => {
    const wrapper = mount(
      <ContribApolloProvider>
        <ToastProvider>
          <MockedProvider>
            <MemoryRouter>
              <CharityProfilePageContent {...props} />
            </MemoryRouter>
          </MockedProvider>
        </ToastProvider>
      </ContribApolloProvider>,
    );
    expect(wrapper.find(Layout)).toHaveLength(1);
  });
});
