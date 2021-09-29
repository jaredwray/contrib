import { ReactWrapper, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import PrivateRoute from 'src/components/routing/PrivateRoute';

jest.mock('react', () => {
  const ActualReact = jest.requireActual('react');
  return {
    ...ActualReact,
    useContext: () => ({
      account: {
        assistant: null,
        charity: null,
        createdAt: '2021-04-13T08:09:54.943Z',
        id: 'test',
        influencerProfile: {
          id: 'testId',
          profileDescription: 'test',
          name: 'test',
          sport: 'test',
        },
        isAdmin: false,
        mongodbId: 'testId',
        notAcceptedTerms: null,
        paymentInformation: {
          id: 'testId',
          cardNumberLast4: '4242',
          cardBrand: 'Visa',
          cardExpirationMonth: 4,
        },
        phoneNumber: '+000000000000',
        status: 'COMPLETED',
      },
    }),
  };
});
describe('Should render correctly "PrivateRoute"', () => {
  const props: any = {
    path: '/test',
    role: 'influencer',
    conmponent: <></>,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return <Route />', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/admin/auctions']}>
        <PrivateRoute {...props} />
      </MemoryRouter>,
    );
    expect(wrapper).toHaveLength(1);
    expect(wrapper.find('Route')).toHaveLength(1);
  });
  it('should return  <Redirect />', () => {
    const wrapper = mount(
      <MemoryRouter>
        <PrivateRoute {...{ ...props, role: 'notAllowed' }} />
      </MemoryRouter>,
    );
    expect(wrapper).toHaveLength(1);
    expect(wrapper.find('Redirect')).toHaveLength(1);
  });
});
