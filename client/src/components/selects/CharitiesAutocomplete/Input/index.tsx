import { BaseSyntheticEvent, FC, useCallback, useEffect, useRef, useState } from 'react';

import { useLazyQuery } from '@apollo/client';
import clsx from 'clsx';
import { Button, Form } from 'react-bootstrap';

import { CharitiesListQuery } from 'src/apollo/queries/charities';
import SearchInput from 'src/components/inputs/SearchInput';
import useOutsideClick from 'src/helpers/useOutsideClick';
import { Charity, CharityStatus } from 'src/types/Charity';

import styles from './styles.module.scss';

interface Props {
  charities: Charity[];
  favoriteCharities: Charity[];
  onChange: (charity: Charity, isFavorite: boolean) => void;
  disabled?: boolean;
  withTitle?: boolean;
}

const CharitiesSearchInput: FC<Props> = ({ charities, favoriteCharities, onChange, disabled, withTitle }) => {
  const [charitiesSearch, setCharitiesSearch] = useState<Charity[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [executeSearch] = useLazyQuery(CharitiesListQuery, {
    onCompleted({ charitiesList }) {
      setCharitiesSearch(charitiesList.items);
    },
  });
  const searchContainer = useRef(null);
  const clearAndCloseSearch = useCallback(() => {
    setSearchQuery('');
    setCharitiesSearch([]);
  }, []);

  useOutsideClick(searchContainer, clearAndCloseSearch);

  const onClickSearch = useCallback(
    (e: BaseSyntheticEvent) => {
      if (!e.target.value) {
        setCharitiesSearch(favoriteCharities);
      }
    },
    [favoriteCharities],
  );

  const onInputSearchChange = useCallback((value) => {
    setSearchQuery(value);
  }, []);

  const isSelectedCharity = useCallback(
    (charity: Charity) => charities.some((favoriteCharity: Charity) => favoriteCharity.id === charity.id),
    [charities],
  );

  const handleToggleCharity = useCallback(
    (charity: Charity) => {
      onChange(charity, !isSelectedCharity(charity));
    },
    [onChange, isSelectedCharity],
  );

  useEffect(() => {
    if (searchQuery) {
      executeSearch({ variables: { filters: { query: searchQuery, status: [CharityStatus.ACTIVE] } } });
    }
  }, [executeSearch, searchQuery]);

  return (
    <Form.Group className={clsx('charities-search-container', { active: charitiesSearch!.length })}>
      {withTitle && <Form.Label>Search</Form.Label>}
      <div ref={searchContainer} className={styles.wrapper}>
        <SearchInput
          disabled={disabled}
          placeholder="Search charities by name"
          onCancel={clearAndCloseSearch}
          onChange={onInputSearchChange}
          onClick={onClickSearch}
        />
        {searchQuery && (
          <ul className={clsx('p-0 m-0', styles.searchResult)}>
            {(charitiesSearch || []).map((charity: Charity, i) => (
              <li
                key={i}
                className={clsx('text-label', styles.resultItem, isSelectedCharity(charity) && styles.selected)}
                title={charity.name}
                onClick={() => handleToggleCharity(charity)}
              >
                <span>{charity.name}</span>
                <Button />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Form.Group>
  );
};
export default CharitiesSearchInput;
