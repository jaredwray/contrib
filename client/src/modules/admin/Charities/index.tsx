import { useState, useCallback, useEffect } from 'react';

import { useLazyQuery } from '@apollo/client';
import clsx from 'clsx';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { CharitiesListQuery, InviteCharityMutation } from 'src/apollo/queries/charities';
import { InviteButton } from 'src/components/buttons/InviteButton';
import { PER_PAGE } from 'src/components/customComponents/Pagination';
import { ActionsDropdown } from 'src/components/forms/selects/ActionsDropdown';
import { AdminPage } from 'src/components/layouts/AdminPage';
import ClickableTr from 'src/components/wrappers/ClickableTr';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { Charity } from 'src/types/Charity';

import styles from './styles.module.scss';

export default function CharitiesPage(): any {
  const [pageSkip, setPageSkip] = useState(0);
  const [getCharitiesList, { loading, data, error }] = useLazyQuery(CharitiesListQuery);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const onInputSearchChange = useCallback((value) => {
    setSearchQuery(value);
  }, []);
  const clearAndCloseSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  useEffect(() => {
    getCharitiesList({
      variables: { size: PER_PAGE, skip: pageSkip, filters: { query: searchQuery }, orderBy: 'STATUS_ASC' },
    });
  }, [getCharitiesList, searchQuery, pageSkip]);

  if (error) return null;

  const charities = data?.charitiesList || { skip: 0, totalItems: 0, items: [] };
  const controlBtns = (
    <InviteButton
      className={clsx(styles.inviteBtn, 'text--body d-inline-block')}
      mutation={InviteCharityMutation}
      updateEntitisList={getCharitiesList}
    />
  );

  setPageTitle('Charities page');

  return (
    <AdminPage
      controlBtns={controlBtns}
      items={charities}
      loading={loading}
      pageSkip={pageSkip}
      setPageSkip={setPageSkip}
      onCancel={clearAndCloseSearch}
      onChange={onInputSearchChange}
    >
      <Table className="d-block d-lg-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Profile Status</th>
            <th>Stripe Acccount Status</th>
            <th className={styles.actions}></th>
          </tr>
        </thead>
        <tbody className="fw-normal">
          {charities.items.map((item: Charity) => (
            <ClickableTr key={item.id} linkTo={`/charity/${item.semanticId || item.id}`}>
              <td className={styles.idColumn}>{item.id}</td>
              <td className={styles.otherColumns}>{item.name}</td>
              <td className={styles.otherColumns}>{item.status}</td>
              <td>{item.profileStatus}</td>
              <td>{item.stripeStatus}</td>
              <td className={styles.actions}>
                <ActionsDropdown>
                  <Link className="dropdown-item text--body" to={`/charity/${item.id}/edit`}>
                    Edit
                  </Link>
                </ActionsDropdown>
              </td>
            </ClickableTr>
          ))}
        </tbody>
      </Table>
    </AdminPage>
  );
}
