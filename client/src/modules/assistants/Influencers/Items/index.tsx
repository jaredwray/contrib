import { FC } from 'react';

import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { ActionsDropdown } from 'src/components/forms/selects/ActionsDropdown';
import ClickableTr from 'src/components/wrappers/ClickableTr';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import styles from './styles.module.scss';

interface Props {
  items: InfluencerProfile[];
}

const Items: FC<Props> = ({ items }) => {
  return (
    <Table className="d-block d-lg-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Sport</th>
          <th className={styles.status}>Status</th>
          <th className={styles.actions}></th>
        </tr>
      </thead>
      <tbody className="fw-normal">
        {items.map((item: InfluencerProfile) => (
          <ClickableTr key={item.id} linkTo={`/profiles/${item.id}`}>
            <td>{item.name}</td>
            <td>{item.sport}</td>
            <td className={styles.status}>{item.status}</td>
            <td className={styles.actions}>
              <ActionsDropdown>
                <Link className="dropdown-item text--body" to={`/profiles/${item.id}/edit`}>
                  Edit
                </Link>
                <Link className={'dropdown-item text--body'} to={`/auctions/${item.id}/new`}>
                  Create Auction
                </Link>
              </ActionsDropdown>
            </td>
          </ClickableTr>
        ))}
      </tbody>
    </Table>
  );
};

export default Items;
