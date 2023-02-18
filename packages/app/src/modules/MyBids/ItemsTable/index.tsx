import { FC } from 'react';

import clsx from 'clsx';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { toFormatedMoney } from 'src/helpers/moneyFormatters';
import { toFormatedDate } from 'src/helpers/timeFormatters';
import { AuctionBid } from 'src/types/Bid';

import styles from './styles.module.scss';

interface Props {
  items: AuctionBid[];
}

const ItemsTable: FC<Props> = ({ items }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Auction Title</th>
          <th className={clsx(styles.money, 'text-wrap')}>Auction Bid Amount</th>
          <th className={styles.date}>Created At</th>
        </tr>
      </thead>
      <tbody className="fw-normal">
        {items.map((item, index) => (
          <tr key={index}>
            <td>
              <Link className={styles.title} title={item.auction?.title} to={`/auctions/${item.auction?.id}`}>
                {item.auction?.title}
              </Link>
            </td>
            <td className={styles.money}>{toFormatedMoney(item.bid)}</td>
            <td className={styles.date}>{toFormatedDate(item.createdAt, 'MMM dd yyyy HH:mm')}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ItemsTable;
