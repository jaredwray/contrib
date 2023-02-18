import { useState, useEffect, useCallback } from 'react';

import { useLazyQuery } from '@apollo/client';
import clsx from 'clsx';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { InfluencersListQuery } from 'src/apollo/queries/influencers';
import { InviteInfluencerMutation } from 'src/apollo/queries/invitations';
import { InviteButton } from 'src/components/buttons/InviteButton';
import { ResendInvitationButton } from 'src/components/buttons/ResendInvitationButton';
import { PER_PAGE, BLANK_LIST_OBJECT } from 'src/components/custom/Pagination';
import { ActionsDropdown } from 'src/components/forms/selects/ActionsDropdown';
import { AdminPage } from 'src/components/layouts/AdminPage';
import ClickableTr from 'src/components/wrappers/ClickableTr';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { InfluencerProfile, InfluencerStatus } from 'src/types/InfluencerProfile';

import { CreateInfluencer } from './CreateInfluencer';
import styles from './styles.module.scss';

export default function InfluencersPage() {
  const [pageSkip, setPageSkip] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [getInfluencersList, { loading, data, error }] = useLazyQuery(InfluencersListQuery, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    getInfluencersList({
      variables: { size: PER_PAGE, skip: pageSkip, filters: { query: searchQuery }, orderBy: 'STATUS_ASC' },
    });
  }, [getInfluencersList, searchQuery, pageSkip]);

  const onInputSearchChange = useCallback((value) => setSearchQuery(value), []);
  const clearAndCloseSearch = useCallback(() => setSearchQuery(''), []);

  if (error) return null;

  const influencers = data?.influencersList || BLANK_LIST_OBJECT;
  const controlBtns = (
    <>
      <CreateInfluencer />
      <InviteButton
        className={clsx(styles.inviteBtn, 'text--body d-inline-block ms-3')}
        mutation={InviteInfluencerMutation}
        updateEntitisList={getInfluencersList}
      />
    </>
  );

  setPageTitle('Admin influencers page');

  return (
    <AdminPage
      controlBtns={controlBtns}
      items={influencers}
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
            <th>Sport</th>
            <th>Status</th>
            <th className={styles.actions}></th>
          </tr>
        </thead>
        <tbody className="fw-normal">
          {influencers.items.map((item: InfluencerProfile) => (
            <ClickableTr key={item.id} linkTo={`/profiles/${item.id}`}>
              <td className={styles.idColumn} title={item.id}>
                {item.id}
              </td>
              <td className={styles.otherColumns}>{item.name}</td>
              <td className={styles.otherColumns}>{item.sport}</td>
              <td className={styles.otherColumns}>{item.status}</td>
              <td className={styles.actions}>
                <ActionsDropdown>
                  <Link className="dropdown-item text--body" to={`/profiles/${item.id}/edit`}>
                    Edit
                  </Link>
                  <Link className={'dropdown-item text--body'} to={`/auctions/${item.id}/new`}>
                    Create Auction
                  </Link>
                  <Link className="dropdown-item text--body" to={`/assistants/${item.id}`}>
                    Assistants
                  </Link>
                  {item.status === InfluencerStatus.TRANSIENT && (
                    <InviteButton
                      className={clsx(styles.inviteActionBtn, 'dropdown-item text--body')}
                      mutation={InviteInfluencerMutation}
                      mutationVariables={{ influencerId: item.id }}
                      text="Invite"
                      updateEntitisList={getInfluencersList}
                      variant="link"
                    />
                  )}
                  {item.status === InfluencerStatus.INVITATION_PENDING && <ResendInvitationButton item={item} />}
                </ActionsDropdown>
              </td>
            </ClickableTr>
          ))}
        </tbody>
      </Table>
    </AdminPage>
  );
}
