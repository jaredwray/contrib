import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from 'react';

import { useLazyQuery } from '@apollo/client';
import clsx from 'clsx';
import { Button, Form, InputGroup } from 'react-bootstrap';

import { CharitiesSearch } from 'src/apollo/queries/charities';
import useOutsideClick from 'src/helpers/useOutsideClick';
import { Charity } from 'src/types/Charity';

import styles from './styles.module.scss';

interface Props {
  charities: Charity[];
  onChange: (charity: Charity, isFavorite: boolean) => void;
}

const CharitiesSearchInput: FC<Props> = ({ charities, onChange }) => {
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
    <Form.Group className={clsx('charities-search-container', { active: searchResult?.charitiesSearch?.length })}>
      <Form.Label>Search</Form.Label>

      <div ref={searchContainer} className={styles.wrapper}>
        <InputGroup>
          <Form.Control
            className={styles.input}
            placeholder="Search charities by name"
            value={searchQuery}
            onChange={onInputSearchChange}
          />
          {searchQuery && (
            <InputGroup.Append className={styles.appendBlock}>
              <Button
                className={clsx(styles.cancelBtn, 'btn-with-input text-all-cups text-label')}
                variant="link"
                onClick={clearAndCloseSearch}
              >
                Cancel
              </Button>
            </InputGroup.Append>
          )}
        </InputGroup>
        <ul className={clsx('p-0 m-0', styles.searchResult)}>
          {(searchResult?.charitiesSearch || []).map((charity: Charity) => (
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
