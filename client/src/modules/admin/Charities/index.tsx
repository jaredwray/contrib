import { useState } from 'react';

import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { AllCharitiesQuery, InviteCharityMutation } from 'src/apollo/queries/charities';
import { ActionsDropdown } from 'src/components/ActionsDropdown';
import { AdminPage } from 'src/components/AdminPage';
import ClickableTr from 'src/components/ClickableTr';
import { InviteButton } from 'src/components/InviteButton';
import { PER_PAGE } from 'src/components/Pagination';
import { Charity } from 'src/types/Charity';

import styles from './styles.module.scss';

export default function CharitiesPage(): any {
  const [pageSkip, setPageSkip] = useState(0);
  const { loading, data, error } = useQuery(AllCharitiesQuery, {
    variables: { size: PER_PAGE, skip: pageSkip },
  });
  if (error) {
    return null;
  }

  const charities = data?.charities || { skip: 0, totalItems: 0, items: [] };
  const controlBtns = (
    <InviteButton className={clsx(styles.inviteBtn, 'text--body d-inline-block')} mutation={InviteCharityMutation} />
  );

  return (
    <AdminPage
      controlBtns={controlBtns}
      items={charities}
      loading={loading}
      pageSkip={pageSkip}
      setPageSkip={setPageSkip}
    >
      <Table className="d-block d-sm-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Profile Status</th>
            <th>Stripe Acccount Status</th>
          </tr>
        </thead>
        <tbody className="font-weight-normal">
          {charities.items.map((item: Charity) => (
            <ClickableTr key={item.id} className="clickable" collection="charity" item={item}>
              <td className={styles.idColumn}>{item.id}</td>
              <td className="break-word">{item.name}</td>
              <td>{item.status}</td>
              <td>{item.profileStatus}</td>
              <td>{item.stripeStatus}</td>
              <td>
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
