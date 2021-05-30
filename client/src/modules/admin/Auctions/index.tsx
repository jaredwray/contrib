import { useState } from 'react';

import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import Dinero from 'dinero.js';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { AuctionsListQuery, updateAuctionDetails } from 'src/apollo/queries/auctions';
import { ActionsDropdown } from 'src/components/ActionsDropdown';
import { AdminPage } from 'src/components/AdminPage';
import { PER_PAGE } from 'src/components/Pagination';
import { Auction, AuctionStatus } from 'src/types/Auction';

import { FairMarketValueChangeButton } from './FairMarketValueChangeButton';
import styles from './styles.module.scss';

export default function CharitiesPage(): any {
  const [pageSkip, setPageSkip] = useState(0);
  const { loading, data, error } = useQuery(AuctionsListQuery, {
    variables: { size: PER_PAGE, skip: pageSkip },
  });

  if (error) {
    return null;
  }
  const auctions = data?.auctions || { skip: 0, totalItems: 0, items: [] };

  return (
    <AdminPage items={auctions} loading={loading} pageSkip={pageSkip} setPageSkip={setPageSkip}>
      <Table className="d-block d-sm-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Price</th>
            <th>Fair Market Value</th>
          </tr>
        </thead>
        <tbody className="font-weight-normal">
          {auctions.items.map((item: Auction) => (
            <tr key={item.id} className="clickable">
              <td className={styles.idColumn}>{item.id}</td>
              <td className="break-word">{item.title}</td>
              <td>{item.status}</td>
              <td>
                {item.currentPrice
                  ? Dinero(item.currentPrice).toFormat('$0,0')
                  : Dinero(item.startPrice).toFormat('$0,0')}
              </td>
              <td>{item.fairMarketValue && Dinero(item.fairMarketValue).toFormat('$0,0')}</td>
              <td>
                <ActionsDropdown>
                  {item.status === AuctionStatus.ACTIVE && (
                    <Link className="dropdown-item text--body" to={`/auctions/${item.id}`}>
                      Go to
                    </Link>
                  )}
                  <FairMarketValueChangeButton
                    auction={item}
                    className={clsx(styles.actionBtn, 'dropdown-item text--body')}
                    mutation={updateAuctionDetails}
                  />
                </ActionsDropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </AdminPage>
  );
}
