import { MouseEvent, useState, SyntheticEvent } from 'react';

import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Table } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';

import { AllInfluencersQuery, InviteInfluencerMutation } from 'src/apollo/queries/influencers';
import { ActionsDropdown } from 'src/components/ActionsDropdown';
import { AdminPage } from 'src/components/AdminPage';
import { InviteButton } from 'src/components/InviteButton';
import { PER_PAGE } from 'src/components/Pagination';
import { InfluencerProfile, InfluencerStatus } from 'src/types/InfluencerProfile';

import { CreateInfluencer } from './CreateInfluencer';
import styles from './styles.module.scss';

export default function InfluencersPage() {
  const [pageSkip, setPageSkip] = useState(0);

  const history = useHistory();

  const { loading, data, error } = useQuery(AllInfluencersQuery, {
    variables: { size: PER_PAGE, skip: pageSkip },
  });
  const handleSelectInfluencer = (influencer: InfluencerProfile, event: MouseEvent) => {
    if (!(event.target as Element).closest('button, .modal')) {
      history.push(`/profiles/${influencer.id}`);
    }
  };
  if (error) {
    return null;
  }

  const influencers = data?.influencers || { skip: 0, totalItems: 0, items: [] };
  const controlBtns = (
    <>
      <CreateInfluencer />
      <InviteButton
        className={clsx(styles.inviteBtn, 'text--body d-inline-block ml-3')}
        mutation={InviteInfluencerMutation}
      />
    </>
  );
  return (
    <AdminPage
      controlBtns={controlBtns}
      items={influencers}
      loading={loading}
      pageSkip={pageSkip}
      setPageSkip={setPageSkip}
    >
      <Table className="d-block d-sm-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Sport</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="font-weight-normal">
          {influencers.items.map((item: any) => (
            <tr key={item.id} className="clickable" onClick={(e: MouseEvent) => handleSelectInfluencer(item, e)}>
              <td className={styles.idColumn} title={item.id}>
                {item.id}
              </td>
              <td className="break-word">{item.name}</td>
              <td className="break-word">{item.sport}</td>
              <td className="break-word">{item.status}</td>
              <td>
                <ActionsDropdown>
                  <Link
                    className="dropdown-item text--body"
                    to={`/assistants/${item.id}`}
                    onClick={(e: SyntheticEvent) => e.stopPropagation()}
                  >
                    Assistants
                  </Link>
                  {item.status === InfluencerStatus.TRANSIENT && (
                    <InviteButton
                      className={clsx(styles.inviteActionBtn, 'dropdown-item text--body')}
                      mutation={InviteInfluencerMutation}
                      mutationVariables={{ influencerId: item.id }}
                      text="Invite"
                      variant="link"
                    />
                  )}
                </ActionsDropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </AdminPage>
  );
}
