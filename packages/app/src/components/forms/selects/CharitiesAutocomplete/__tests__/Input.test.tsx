import React from 'react';
import { mount } from 'enzyme';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import SearchInput from 'src/components/forms/inputs/SearchInput';
import CharitiesSearchInput from 'src/components/forms/selects/CharitiesAutocomplete/Input';
import { CharitiesListQuery } from 'src/apollo/queries/charities';
import { charity } from 'src/helpers/testHelpers/charity';
import { act } from 'react-dom/test-utils';

const cache = new InMemoryCache();

cache.writeQuery({
  query: CharitiesListQuery,
  variables: { filters: { query: '', status: ['ACTIVE'] } },
  data: {
    charitiesList: {
      items: [
        {
          id: 'testId1',
          name: 'test',
          profileStatus: 'COMPLETED',
          status: 'ACTIVE',
          stripeStatus: 'ACTIVE',
          avatarUrl: 'test url',
          totalRaisedAmount: 0,
          followers: {
            user: '222',
          },
        },
      ],
      size: 20,
      skip: 0,
      totalItems: 1,
    },
  },
});

describe('Should render correctly "CharitiesSearchInput"', () => {
  const props: any = {
    charities: [{ id: 'test', name: 'test' }],
    favoriteCharities: [charity, charity],
    onChange: jest.fn(),
  };

  it('component is defined', async () => {
    await act(async () => {
      const wrapper = mount(
        <MockedProvider cache={cache}>
          <CharitiesSearchInput {...props} />
        </MockedProvider>,
      );

      await new Promise((resolve) => setTimeout(resolve));
      wrapper.update();

      wrapper.find(SearchInput).children().find('input').simulate('click');
      wrapper.find(SearchInput).props().onChange('test');

      wrapper.update();

      expect(wrapper.find('li')).toHaveLength(2);
      wrapper.find('li').at(0).simulate('click');

      wrapper.find(SearchInput).prop('onCancel')!();
    });
  });
});
