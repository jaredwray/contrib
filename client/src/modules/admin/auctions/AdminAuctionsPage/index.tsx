import { useState } from 'react';

import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import Dinero from 'dinero.js';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { AuctionsListQuery, updateAuctionDetails, stopAuction, activateAuction } from 'src/apollo/queries/auctions';
import { ActionsDropdown } from 'src/components/ActionsDropdown';
import { AdminPage } from 'src/components/AdminPage';
import ClickableTr from 'src/components/ClickableTr';
import { PER_PAGE } from 'src/components/Pagination';
import { Auction } from 'src/types/Auction';

import { FairMarketValueChangeButton } from './FairMarketValueChangeButton';
import { StopOrActiveButton } from './StopOrActiveButton';
import styles from './styles.module.scss';

export default function AdminAuctionsPage() {
  const [pageSkip, setPageSkip] = useState(0);
  const { loading, data, error } = useQuery(AuctionsListQuery, {
    variables: { size: PER_PAGE, skip: pageSkip },
    fetchPolicy: 'network-only',
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
            <th></th>
          </tr>
        </thead>
        <tbody className="font-weight-normal">
          {auctions.items.map((auction: Auction) => (
            <ClickableTr key={auction.id} linkTo={`/auctions/${auction.id}${auction.isDraft ? '/basic' : ''}`}>
              <td className={styles.idColumn}>{auction.id}</td>
              <td className="break-word">{auction.title}</td>
              <td>{auction.status}</td>
              <td>
                {auction.currentPrice
                  ? Dinero(auction.currentPrice).toFormat('$0,0')
                  : Dinero(auction.startPrice).toFormat('$0,0')}
              </td>
              <td>{auction.fairMarketValue && Dinero(auction.fairMarketValue).toFormat('$0,0')}</td>
              <td>
                <ActionsDropdown>
                  <Link className="dropdown-item text--body" to={`/admin/auctions/${auction.id}`}>
                    View details
                  </Link>
                  {(auction.isPending || auction.isDraft) && (
                    <Link className={'dropdown-item text--body'} to={`/auctions/${auction.id}/basic`}>
                      Edit
                    </Link>
                  )}
                  {(auction.isActive || auction.isPending) && (
                    <FairMarketValueChangeButton
                      auction={auction}
                      className={clsx(styles.actionBtn, 'dropdown-item text--body')}
                      mutation={updateAuctionDetails}
                    />
                  )}
                  {(auction.isActive || auction.isPending || auction.isStopped) && (
                    <StopOrActiveButton
                      auction={auction}
                      className={clsx(styles.actionBtn, 'dropdown-item text--body')}
                      mutation={auction.isStopped ? activateAuction : stopAuction}
                    />
                  )}
                </ActionsDropdown>
              </td>
            </ClickableTr>
          ))}
        </tbody>
      </Table>
    </AdminPage>
  );
}
