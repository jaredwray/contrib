import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from 'react';

import { useLazyQuery, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Button, Form, InputGroup } from 'react-bootstrap';

import { CharitiesSearch, MyFavoriteCharitiesQuery } from 'src/apollo/queries/charities';
import useOutsideClick from 'src/helpers/useOutsideClick';
import { Charity } from 'src/types/Charity';

import styles from './styles.module.scss';

interface Props {
  charities: Charity[];
  onChange: (charity: Charity, isFavorite: boolean) => void;
}
const CharitiesSearchInput: FC<Props> = ({ charities, onChange }) => {
  const [charitiesSearch, setCharitiesSearch] = useState<Charity[]>([]);
  const { data: myAccountsData } = useQuery(MyFavoriteCharitiesQuery);
  const [executeSearch] = useLazyQuery(CharitiesSearch, {
    onCompleted({ charitiesSearch }) {
      setCharitiesSearch(charitiesSearch);
    },
  });
  const searchContainer = useRef(null);
  const favoriteCharities = myAccountsData?.myAccount?.influencerProfile?.favoriteCharities;
  const [searchQuery, setSearchQuery] = useState('');
  const clearAndCloseSearch = useCallback(() => {
    setSearchQuery('');
    setCharitiesSearch([]);
  }, []);

  useOutsideClick(searchContainer, clearAndCloseSearch);

  const onClickSearch = useCallback(
    (e: any) => {
      if (!e.target.value) {
        setCharitiesSearch(favoriteCharities);
      }
    },
    [favoriteCharities],
  );

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
    <Form.Group className={clsx('charities-search-container', { active: charitiesSearch!.length })}>
      <Form.Label>Search</Form.Label>
      <div ref={searchContainer} className={styles.wrapper}>
        <InputGroup>
          <Form.Control
            className={styles.input}
            placeholder="Search charities by name"
            value={searchQuery}
            onChange={onInputSearchChange}
            onClick={onClickSearch}
          />
          {(searchQuery || Boolean(charitiesSearch.length)) && (
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
