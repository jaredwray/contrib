import CharitiesDropdown from '../Filters/CharitiesDropdown';
import { InMemoryCache } from '@apollo/client';
import { ReactWrapper, mount } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import Select from 'src/components/Select';
import { AllCharitiesQuery } from 'src/apollo/queries/charities';
import { act } from 'react-dom/test-utils';
import { CharityStatus } from 'src/types/Charity';

describe('Should render correctly "StatusDropdown"', () => {
  const props: any = {
    selectedCharities: [],
    changeFilters: jest.fn(),
  };
  const cache = new InMemoryCache();
  cache.writeQuery({
    query: AllCharitiesQuery,
    variables: { size: 0, skip: 0, status: [CharityStatus.ACTIVE] },
    data: {
      charities: {
        items: [{ id: 'testId1', name: 'test', profileStatus: 'COMPLETED', status: 'ACTIVE', stripeStatus: 'ACTIVE' }],
        size: 20,
        skip: 0,
        totalItems: 1,
      },
    },
  });

  it('component returns null', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MockedProvider>
          <CharitiesDropdown {...props} />
        </MockedProvider>,
      );
    });
    expect(wrapper!.find(Select)).toHaveLength(0);
  });
  it('component is defined and has Select', async () => {
    let wrapper: ReactWrapper;
    await act(async () => {
      wrapper = mount(
        <MockedProvider cache={cache}>
          <CharitiesDropdown {...props} />
        </MockedProvider>,
      );

      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();

      expect(wrapper).toHaveLength(1);
      expect(wrapper.find(Select)).toHaveLength(1);

      wrapper.find(Select).props().onChange('All');
      expect(props.changeFilters).toHaveBeenCalledTimes(1);
    });
  });
});
