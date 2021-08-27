import { FC } from 'react';

import clsx from 'clsx';
import { format } from 'date-fns';
import { Row, Spinner } from 'react-bootstrap';

import styles from './styles.module.scss';

interface Props {
  loading?: boolean;
  name?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  street?: string;
  incomingState?: string;
  arrivalDate?: string;
  subtitle?: string;
  phoneNumber?: string;
  isStatusPage?: boolean;
  auctionTitle?: string;
}

export const DeliveryTextBlock: FC<Props> = ({
  loading,
  name,
  city,
  street,
  state,
  zipCode,
  incomingState,
  arrivalDate,
  subtitle,
  phoneNumber,
  isStatusPage,
  auctionTitle,
  children,
}) => {
  return (
    <>
      {loading ? (
        <Row className={clsx(styles.deliveryInfo, 'justify-content-center align-items-center w-100')}>
          <Spinner animation="border" size="sm" />
        </Row>
      ) : (
        <div className="text-subhead pt-3">
          {isStatusPage && (
            <>
              <div className="text-center pt-1 pb-3">
                of<span className={styles.markedText}>{auctionTitle}</span>auction
              </div>
              <div className="text-center pt-1 pb-3">
                Estimated delivery time is
                <span className={styles.markedText}>{format(new Date(arrivalDate!), 'MM/dd/yyyy')}</span>
              </div>
            </>
          )}
          {subtitle && <p>{subtitle}</p>}
          <div>
            Recepient:<span className={styles.markedText}>{name}</span>
          </div>
          <div>
            City:<span className={styles.markedText}>{city}</span>
          </div>
          <div>
            Street:<span className={styles.markedText}>{street}</span>
          </div>
          <div>
            State:<span className={styles.markedText}>{incomingState}</span>
          </div>
          <div>
            Post code:
            <span className={styles.markedText}>
              {state}-{zipCode}
            </span>
          </div>
          <div>
            Phone number:
            <span className={styles.markedText}>+{phoneNumber}</span>
          </div>
          {arrivalDate && !isStatusPage && (
            <div>
              Estimated arrival date:
              <span className={styles.markedText}>{format(new Date(arrivalDate), 'MM/dd/yyyy')}</span>
            </div>
          )}
        </div>
      )}
      {children}
    </>
  );
};
