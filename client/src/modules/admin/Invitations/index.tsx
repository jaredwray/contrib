import { useCallback, useState, useEffect } from 'react';

import { useLazyQuery, useMutation } from '@apollo/client';
import clsx from 'clsx';
import { Table } from 'react-bootstrap';

import { InvitationsQuery, ApproveInvitationMutation, DeclineInvitationMutation } from 'src/apollo/queries/invitations';
import { ResendInvitationButton } from 'src/components/buttons/ResendInvitationButton';
import { PER_PAGE } from 'src/components/custom/Pagination';
import { ActionsDropdown } from 'src/components/forms/selects/ActionsDropdown';
import ActionsDropdownItem from 'src/components/forms/selects/ActionsDropdownItem';
import { AdminPage } from 'src/components/layouts/AdminPage';
import { toFormatedDate } from 'src/helpers/dateHelpers';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { Invitation, InvitationStatus } from 'src/types/Invitation';

import styles from './styles.module.scss';

export default function Invitations() {
  const [pageSkip, setPageSkip] = useState(0);
  const { showError, showMessage } = useShowNotification();

  const [getInvitations, { loading, data, error }] = useLazyQuery(InvitationsQuery, {
    fetchPolicy: 'cache-and-network',
  });
  const [approve, { loading: approving }] = useMutation(ApproveInvitationMutation);
  const [decline, { loading: declining }] = useMutation(DeclineInvitationMutation);

  const canApprove = useCallback(
    (item: Invitation) => item.status && [InvitationStatus.PROPOSED, InvitationStatus.DECLINED].includes(item.status),
    [],
  );
  const canDecline = useCallback((item: Invitation) => item.status && item.status === InvitationStatus.PROPOSED, []);
  const canResend = useCallback(
    (item: Invitation) => !item.accepted && item.status && [InvitationStatus.PENDING, undefined].includes(item.status),
    [],
  );
  const hasActions = useCallback((item: Invitation) => canApprove(item) || canResend(item), [canApprove, canResend]);
  const refreshData = useCallback(
    () =>
      getInvitations({
        variables: { params: { size: PER_PAGE, skip: pageSkip } },
      }),

    [getInvitations, pageSkip],
  );
  const onApprove = useCallback(
    async (item: Invitation) => {
      try {
        await approve({ variables: { id: item.id } });
        refreshData();
        showMessage('Approved');
      } catch (error) {
        showError(error.message);
      }
    },
    [showMessage, showError, approve, refreshData],
  );
  const onDecline = useCallback(
    async (item: Invitation) => {
      try {
        await decline({ variables: { id: item.id } });
        refreshData();
        showMessage('Declined');
      } catch (error) {
        showError(error.message);
      }
    },
    [showMessage, showError, decline, refreshData],
  );

  useEffect(() => refreshData(), [refreshData]);

  if (error) return null;

  const invitations = data?.invitations || { skip: 0, totalItems: 0, items: [] };

  setPageTitle('Admin invitations page');

  return (
    <AdminPage items={invitations} loading={loading} pageSkip={pageSkip} setPageSkip={setPageSkip}>
      <Table className={clsx(styles.table, 'd-block d-lg-table')}>
        <thead>
          <tr>
            <th>ID</th>
            <th>phone number</th>
            <th>first or full name</th>
            <th>last name</th>
            <th>status</th>
            <th>type</th>
            <th>created at</th>
            <th className={styles.actions}></th>
          </tr>
        </thead>
        <tbody className="fw-normal">
          {invitations.items.map((item: Invitation, index: number) => (
            <tr key={index}>
              <td className={styles.idColumn} title={item.id}>
                {item.id}
              </td>
              <td>{item.phoneNumber}</td>
              <td>{item.firstName}</td>
              <td>{item.lastName}</td>
              <td className={clsx(item.status && styles[`${item.status?.toLowerCase()}Status`], 'text-nowrap')}>
                {item.status}
              </td>
              <td className="text-nowrap">{item.parentEntityType}</td>
              <td>{toFormatedDate(item.createdAt)}</td>
              <td className={clsx(styles.actions, 'p-0')}>
                <ActionsDropdown disabled={!hasActions(item)}>
                  {canApprove(item) && (
                    <ActionsDropdownItem
                      disabled={declining}
                      loading={approving}
                      text="Approve"
                      onClick={() => onApprove(item)}
                    />
                  )}
                  {canDecline(item) && (
                    <ActionsDropdownItem
                      disabled={approving}
                      loading={declining}
                      text="Decline"
                      onClick={() => onDecline(item)}
                    />
                  )}
                  {canResend(item) && <ResendInvitationButton item={item} />}
                </ActionsDropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </AdminPage>
  );
}
