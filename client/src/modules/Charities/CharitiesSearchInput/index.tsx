import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from 'react';

import { useLazyQuery } from '@apollo/client';
import clsx from 'clsx';
import { Button, Form, InputGroup } from 'react-bootstrap';

import { CharitiesSearch } from 'src/apollo/queries/charities';
import useOutsideClick from 'src/helpers/useOutsideClick';
import { Charity } from 'src/types/Charity';

import './styles.scss';

interface Props {
  charities: Charity[];
  onCharityFavoriteChange: (charity: Charity, isFavorite: boolean) => void;
}

export const CharitiesSearchInput: FC<Props> = ({ charities, onCharityFavoriteChange }) => {
  const [executeSearch, { data: searchResult }] = useLazyQuery(CharitiesSearch);
  const searchContainer = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');

  const clearAndCloseSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  useOutsideClick(searchContainer, clearAndCloseSearch);

  const onInputSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const isSelectedCharity = (charity: Charity) =>
    charities.some((favoriteCharity: Charity) => favoriteCharity.id === charity.id);

  const handleToggleCharity = useCallback(
    (charity: Charity) => {
      onCharityFavoriteChange(charity, !isSelectedCharity(charity));
    },
    [searchResult, onCharityFavoriteChange],
  );

  useEffect(() => {
    executeSearch({ variables: { query: searchQuery } });
  }, [searchQuery]);

  return (
    <Form.Group className={clsx('charities-search-container', { active: searchResult?.charitiesSearch?.length })}>
      <Form.Label>Search</Form.Label>

      <div ref={searchContainer}>
        <InputGroup>
          <Form.Control
            className="charities-search-input"
            placeholder="Search charities by name"
            value={searchQuery}
            onChange={onInputSearchChange}
          />
          {searchQuery && (
            <InputGroup.Append>
              <Button
                className="charities-search-cancel-btn btn-with-input text-all-cups text-label"
                variant="link"
                onClick={clearAndCloseSearch}
              >
                Cancel
              </Button>
            </InputGroup.Append>
          )}
        </InputGroup>
        <ul className="p-0 m-0 charities-search-result">
          {(searchResult?.charitiesSearch || []).map((charity: Charity) => (
            <li
              key={charity.id}
              className={clsx('text-label charities-search-result-item', {
                selected: isSelectedCharity(charity),
              })}
              title={charity.name}
              onClick={() => handleToggleCharity(charity)}
            >
              <span>{charity.name}</span>
              <Button />
            </li>
          ))}
        </ul>
      </div>
    </Form.Group>
  );
};
