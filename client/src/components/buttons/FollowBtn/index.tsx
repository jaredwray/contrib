import { FC, useCallback } from 'react';

import { Row, Col, Spinner } from 'react-bootstrap';

import FollowIcon from 'src/assets/icons/FollowIcon';

import styles from './styles.module.scss';

interface Props {
  followed?: boolean | undefined;
  entityType?: string;
  followersNumber?: number | undefined;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  followHandler: () => Promise<void>;
  unfollowHandler: () => Promise<void>;
}

const FollowBtn: FC<Props> = ({
  followersNumber,
  followHandler,
  unfollowHandler,
  entityType,
  followed,
  loading,
  disabled,
  className,
}) => {
  const onClick = useCallback(() => {
    if (disabled || loading) return null;

    followed ? unfollowHandler() : followHandler();
  }, [disabled, loading, followed, unfollowHandler, followHandler]);

  return (
    <Row className={className}>
      <Col>
        Follow this {entityType}
        <div className="link clickable" onClick={onClick}>
          Get updates sent to your phone
        </div>
      </Col>
      <Col xs="1">
        {loading ? (
          <div className="pt-1">
            <Spinner
              animation="border"
              aria-hidden="true"
              as="span"
              className={styles.spinner}
              role="status"
              size="sm"
            />
          </div>
        ) : (
          <span className="clickable" onClick={onClick}>
            <FollowIcon followed={followed} />
          </span>
        )}
      </Col>
    </Row>
  );
};

export default FollowBtn;
