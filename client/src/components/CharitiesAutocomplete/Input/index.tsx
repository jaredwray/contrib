import { BaseSyntheticEvent, FC, useCallback, useEffect, useRef, useState } from 'react';

import { useLazyQuery } from '@apollo/client';
import clsx from 'clsx';
import { Button, Form } from 'react-bootstrap';

import { CharitiesSearch } from 'src/apollo/queries/charities';
import SearchInput from 'src/components/SearchInput';
import useOutsideClick from 'src/helpers/useOutsideClick';
import { Charity } from 'src/types/Charity';

import styles from './styles.module.scss';

interface Props {
  charities: Charity[];
  favoriteCharities: Charity[];
  onChange: (charity: Charity, isFavorite: boolean) => void;
  disabled?: boolean;
}

const CharitiesSearchInput: FC<Props> = ({ charities, favoriteCharities, onChange, disabled }) => {
  const [charitiesSearch, setCharitiesSearch] = useState<Charity[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [executeSearch] = useLazyQuery(CharitiesSearch, {
    onCompleted({ charitiesSearch }) {
      setCharitiesSearch(charitiesSearch);
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
    executeSearch({ variables: { query: searchQuery } });
  }, [executeSearch, searchQuery]);

  return (
    <Form.Group className={clsx('charities-search-container', { active: charitiesSearch!.length })}>
      <Form.Label>Search</Form.Label>
      <div ref={searchContainer} className={styles.wrapper}>
        <SearchInput
          disabled={disabled}
          placeholder="Search charities by name"
          onCancel={clearAndCloseSearch}
          onChange={onInputSearchChange}
          onClick={onClickSearch}
        />
        <ul className={clsx('p-0 m-0', styles.searchResult)}>
          {(charitiesSearch || []).map((charity: Charity) => (
            <li
              key={charity.id}
              className={clsx('text-label', styles.resultItem, isSelectedCharity(charity) && styles.selected)}
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
export default CharitiesSearchInput;
