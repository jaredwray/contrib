import { FC, useCallback } from 'react';

import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import { Spinner } from 'react-bootstrap';

import { ResendInviteMessageMutation } from 'src/apollo/queries/invitations';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { InfluencerProfile } from 'src/types/InfluencerProfile';
import { Invitation } from 'src/types/Invitation';

import styles from './styles.module.scss';

interface Props {
  item: InfluencerProfile | Invitation;
}

export const ResendInvitationButton: FC<Props> = ({ item }) => {
  const { showError, showMessage } = useShowNotification();

  const [resendInviteMessage, { loading: resendInviteLoading }] = useMutation(ResendInviteMessageMutation);

  const resendToastMessage = useCallback(
    (link: string, firstName: string, phoneNumber: string) =>
      (
        <>
          <div className="pb-2">Successfully resended!</div>
          <div>Phonenumber: {phoneNumber}</div>
          <div>Name: {firstName}</div>
          <div>Invitation Link: {link}</div>
        </>
      ).toString(),
    [],
  );

  const resendMessage = useCallback(
    async (item) => {
      try {
        await resendInviteMessage({ variables: { influencerId: item.id, name: item.name } }).then(({ data }) => {
          const { link, firstName, phoneNumber } = data.resendInviteMessage;
          showMessage(resendToastMessage(link, firstName, phoneNumber));
        });
      } catch (error) {
        showError(error.message);
      }
    },
    [showError, resendInviteMessage, showMessage, resendToastMessage],
  );

  return resendInviteLoading ? (
    <div className={clsx(styles.button, 'dropdown-item text-center')}>
      <Spinner animation="border" aria-hidden="true" as="span" role="status" size="sm" />
    </div>
  ) : (
    <div className={clsx(styles.button, 'dropdown-item text--body w-100')} onClick={() => resendMessage(item)}>
      Resend Invite Message
    </div>
  );
};
