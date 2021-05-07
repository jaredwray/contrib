import { useState, MouseEvent } from 'react';

import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import { AllCharitiesQuery, InviteCharityMutation } from 'src/apollo/queries/charities';
import { AdminPage } from 'src/components/AdminPage';
import { InviteButton } from 'src/components/InviteButton';
import { PER_PAGE } from 'src/components/Pagination';
import { Charity } from 'src/types/Charity';

import styles from './styles.module.scss';

export default function CharitiesPage(): any {
  const [pageSkip, setPageSkip] = useState(0);

  const history = useHistory();

  const { loading, data, error } = useQuery(AllCharitiesQuery, {
    variables: { size: PER_PAGE, skip: pageSkip },
  });
  const handleSelectCharity = (charity: Charity, event: MouseEvent) => {
    if (!(event.target as Element).closest('button, .modal')) {
      history.push(`/charity/${charity.id}`);
    }
  };
  if (error) {
    return null;
  }

  const charities = data?.charities || { skip: 0, totalItems: 0, items: [] };
  const controlBtns = (
    <InviteButton
      className={clsx(styles.inviteBtn, 'text--body d-inline-block ml-3')}
      mutation={InviteCharityMutation}
    />
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
          {charities.items.map((item: any) => (
            <tr key={item.id} className="clickable" onClick={(e: MouseEvent) => handleSelectCharity(item, e)}>
              <td className={styles.idColumn}>{item.id}</td>
              <td className="break-word">{item.name}</td>
              <td>{item.status}</td>
              <td>{item.profileStatus}</td>
              <td>{item.stripeStatus}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </AdminPage>
  );
}
