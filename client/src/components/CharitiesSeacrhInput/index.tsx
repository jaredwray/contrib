import { useCallback, useEffect, useRef, MouseEvent, ChangeEvent } from 'react';

import { useLazyQuery } from '@apollo/client';
import { Button, Form, InputGroup } from 'react-bootstrap';

import { CharitiesSearch } from 'src/apollo/queries/charities';
import FavoriteCharitiesList from 'src/components/FavoriteCharitiesList';
import useOutsideClick from 'src/helpers/useOutsideClick';
import { Charity } from 'src/types/Charity';

import './styles.scss';

export default function CharitiesSeacrhInput({ state, updateState }: { state: any; updateState: any }) {
  const [executeSearch, { data: searchResult }] = useLazyQuery(CharitiesSearch);
  const searchInput = useRef(null);
  const searchConteiner = useRef(null);

  const clearAndCloseSearch = useCallback(() => {
    if (searchInput) {
      // @ts-ignore: Object is possibly 'null'.
      searchInput.current.value = '';
    }
    updateState('searchQuery', '');
  }, [state.searchQuery]);

  useOutsideClick(searchConteiner, clearAndCloseSearch);

  const onInputSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    updateState('searchQuery', target.value);
  }, []);

  const selectedCharity = (charity: Charity) => state.favoriteCharities.some((e: Charity) => e.id === charity.id);

  const removeFromFavoriteCharities = (charityId: string | undefined) => {
    if (charityId) {
      const filteredFavoriteCharities = state.favoriteCharities.filter((charity: Charity) => charity.id !== charityId);
      updateState('favoriteCharities', filteredFavoriteCharities);
    }
  };

  const onSerchResultClick = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      e.preventDefault();
      const target = e.target as HTMLElement;

      if (target.tagName === 'BUTTON') {
        const selectedCharity = searchResult.charitiesSearch.filter(
          (charity: Charity) => charity.id === target.dataset.charityId,
        );

        if (target.parentElement?.classList.contains('selected')) {
          removeFromFavoriteCharities(target.dataset.charityId);
        } else {
          updateState('favoriteCharities', state.favoriteCharities.concat(selectedCharity));
        }
      }
    },
    [searchResult, state.favoriteCharities],
  );

  useEffect(() => {
    executeSearch({ variables: { query: state.searchQuery } });
  }, [state.searchQuery]);

  return (
    <>
      <Form.Group
        className={'charities-search-container mb-0 ' + (searchResult?.charitiesSearch?.length ? 'active' : '')}
      >
        <Form.Label>Search</Form.Label>

        <div ref={searchConteiner}>
          <InputGroup>
            <Form.Control
              ref={searchInput}
              className="charities-search-input"
              placeholder="Search charities by name"
              onChange={onInputSearchChange}
            />
            {state.searchQuery && (
              <InputGroup.Append>
                <Button
                  className="charities-search-cancel-btn with-input text-all-cups text-label"
                  variant="link"
                  onClick={clearAndCloseSearch}
                >
                  Cancel
                </Button>
              </InputGroup.Append>
            )}
          </InputGroup>
          <ul className="charities-search-result p-0 m-0" onClick={onSerchResultClick}>
            {(searchResult?.charitiesSearch || []).map((charity: Charity) => (
              <li
                key={'search-result-' + charity.id}
                className={'charities-search-result-item text-label ' + (selectedCharity(charity) ? 'selected' : '')}
                title={charity.name}
              >
                <span>{charity.name}</span>
                <Button data-charity-id={charity.id} />
              </li>
            ))}
          </ul>
        </div>
      </Form.Group>
      <FavoriteCharitiesList
        removeFromFavoriteCharities={removeFromFavoriteCharities}
        state={state}
        updateState={updateState}
      />
    </>
  );
}
