import { useState } from 'react';

import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Table } from 'react-bootstrap';

import { AllCharitiesQuery, InviteCharityMutation } from 'src/apollo/queries/charities';
import { AdminPage } from 'src/components/AdminPage';
import { InviteButton } from 'src/components/InviteButton';
import { PER_PAGE } from 'src/components/Pagination';

import styles from './styles.module.scss';

export default function CharitiesPage(): any {
  const [pageSkip, setPageSkip] = useState(0);

  const { loading, data, error } = useQuery(AllCharitiesQuery, {
    variables: { size: PER_PAGE, skip: pageSkip },
  });

  if (error) {
    return null;
  }

  const controlBtns = (
    <InviteButton
      className={clsx(styles.inviteBtn, 'text--body d-inline-block ml-3')}
      mutation={InviteCharityMutation}
    />
  );

  const charities = data?.charities || { skip: 0, totalItems: 0, items: [] };

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
          </tr>
        </thead>
        <tbody className="font-weight-normal">
          {charities.items.map((item: any) => (
            <tr key={item.id} className="clickable">
              <td>{item.id}</td>
              <td className="break-word">{item.name}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </AdminPage>
  );
}
