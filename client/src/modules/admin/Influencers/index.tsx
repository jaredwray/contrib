import { useState, useEffect, useCallback } from 'react';

import { useLazyQuery, useMutation } from '@apollo/client';
import clsx from 'clsx';
import { Table, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import {
  InfluencersListQuery,
  InviteInfluencerMutation,
  ResendInviteMessageMutation,
} from 'src/apollo/queries/influencers';
import { InviteButton } from 'src/components/buttons/InviteButton';
import { PER_PAGE } from 'src/components/customComponents/Pagination';
import { ActionsDropdown } from 'src/components/forms/selects/ActionsDropdown';
import { AdminPage } from 'src/components/layouts/AdminPage';
import ClickableTr from 'src/components/wrappers/ClickableTr';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { InfluencerProfile, InfluencerStatus } from 'src/types/InfluencerProfile';

import { CreateInfluencer } from './CreateInfluencer';
import styles from './styles.module.scss';

export default function InfluencersPage() {
  const { addToast } = useToasts();
  const [pageSkip, setPageSkip] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [getInfluencersList, { loading, data, error }] = useLazyQuery(InfluencersListQuery, {
    fetchPolicy: 'cache-and-network',
  });

  const [resendInviteMessage, { loading: resendInviteLoading }] = useMutation(ResendInviteMessageMutation);

  useEffect(() => {
    getInfluencersList({
      variables: { size: PER_PAGE, skip: pageSkip, filters: { query: searchQuery }, orderBy: 'STATUS_ASC' },
    });
  }, [getInfluencersList, searchQuery, pageSkip]);

  const onInputSearchChange = useCallback((value) => {
    setSearchQuery(value);
  }, []);

  const clearAndCloseSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const toastContent = useCallback(
    (link: string, firstName: string, phoneNumber: string) => (
      <>
        <div className="pb-2">Successfully resended!</div>
        <div>Phonenumber: {phoneNumber}</div>
        <div>Name: {firstName}</div>
        <div>Invitation Link: {link}</div>
      </>
    ),
    [],
  );

  const resendMessage = useCallback(
    async (item) => {
      try {
        await resendInviteMessage({ variables: { influencerId: item.id, name: item.name } }).then(({ data }) => {
          const { link, firstName, phoneNumber } = data.resendInviteMessage;
          addToast(toastContent(link, firstName, phoneNumber), {
            autoDismiss: true,
            appearance: 'success',
          });
        });
      } catch (error) {
        addToast(error.message, { autoDismiss: true, appearance: 'warning' });
      }
    },
    [addToast, resendInviteMessage, toastContent],
  );
  if (error) {
    return null;
  }

  const influencers = data?.influencersList || { skip: 0, totalItems: 0, items: [] };

  setPageTitle('Admin nfluencers auction page');
  const controlBtns = (
    <>
      <CreateInfluencer />
      <InviteButton
        className={clsx(styles.inviteBtn, 'text--body d-inline-block ml-3')}
        mutation={InviteInfluencerMutation}
        updateEntitisList={getInfluencersList}
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
        <tbody className="font-weight-normal">
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

                  {item.status === InfluencerStatus.INVITATION_PENDING &&
                    (resendInviteLoading ? (
                      <div className={clsx(styles.inviteActionBtn, 'dropdown-item text-center')}>
                        <Spinner animation="border" aria-hidden="true" as="span" role="status" size="sm" />
                      </div>
                    ) : (
                      <Button
                        className={clsx(styles.inviteActionBtn, 'dropdown-item text--body w-100 ')}
                        data-test-id="resend-button"
                        variant="link"
                        onClick={() => resendMessage(item)}
                      >
                        Resend Invite Message
                      </Button>
                    ))}
                </ActionsDropdown>
              </td>
            </ClickableTr>
          ))}
        </tbody>
      </Table>
    </AdminPage>
  );
}
