import { useState, useEffect, useCallback } from 'react';

import { useLazyQuery } from '@apollo/client';
import clsx from 'clsx';
import Dinero from 'dinero.js';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import {
  AuctionsListQuery,
  UpdateAuctionMutation,
  StopAuctionMutation,
  ActivateAuctionMutation,
  DeleteAuctionMutation,
  UpdateAuctionParcelMutation,
} from 'src/apollo/queries/auctions';
import { ActionsDropdown } from 'src/components/ActionsDropdown';
import { AdminPage } from 'src/components/AdminPage';
import ClickableTr from 'src/components/ClickableTr';
import { PER_PAGE } from 'src/components/Pagination';
import { ParcelProps } from 'src/helpers/ParcelProps';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { Auction, AuctionDeliveryStatus } from 'src/types/Auction';

import { DeleteAuctionButton } from './DeleteAuctionButton';
import { EditDeliveryParcelButton } from './EditDeliveryParcelButton';
import { FairMarketValueChangeButton } from './FairMarketValueChangeButton';
import { StopOrActiveButton } from './StopOrActiveButton';
import styles from './styles.module.scss';

export default function AdminAuctionsPage() {
  const [pageSkip, setPageSkip] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [getAuctionsList, { loading, data, error }] = useLazyQuery(AuctionsListQuery, {
    variables: { size: PER_PAGE, skip: pageSkip, query: searchQuery },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    getAuctionsList();
  }, [getAuctionsList]);

  const clearAndCloseSearch = useCallback(() => {
    setSearchQuery('');
  }, [setSearchQuery]);

  const onInputSearchChange = useCallback(
    (value) => {
      setSearchQuery(value);
    },
    [setSearchQuery],
  );

  if (error) {
    return null;
  }

  const auctions = data?.auctions || { skip: 0, totalItems: 0, items: [] };

  setPageTitle('Auctions page');

  return (
    <AdminPage
      items={auctions}
      loading={loading}
      pageSkip={pageSkip}
      setPageSkip={setPageSkip}
      onCancel={clearAndCloseSearch}
      onChange={onInputSearchChange}
    >
      <Table className="d-block d-lg-table">
        <thead>
          <tr className={styles.tHead}>
            <th className={styles.tId}>ID</th>
            <th>Name</th>
            <th>Influencer</th>
            <th>Status</th>
            <th>Price</th>
            <th>Fair Market Value</th>
            <th>Delivery parcel properties</th>
            <th className={styles.actions}></th>
          </tr>
        </thead>
        <tbody className="font-weight-normal">
          {auctions.items.map((auction: Auction) => (
            <ClickableTr key={auction.id} linkTo={`/auctions/${auction.isDraft ? `${auction.id}/title` : auction.id}`}>
              <td className={styles.idColumn}>{auction.id}</td>
              <td className={styles.otherColumns}>{auction.title}</td>
              <td className={styles.otherColumns}>{auction.auctionOrganizer.name}</td>
              <td>{auction.status}</td>
              <td>{Dinero(auction.currentPrice ?? auction.startPrice).toFormat('$0,0')}</td>
              <td>{auction.fairMarketValue && Dinero(auction.fairMarketValue).toFormat('$0,0')}</td>
              <td>{auction.delivery.parcel && ParcelProps(auction)}</td>
              <td className={styles.actions}>
                <ActionsDropdown>
                  <Link className="dropdown-item text--body" to={`/admin/auctions/${auction.id}`}>
                    View details
                  </Link>
                  {(auction.isDraft || auction.isStopped || auction.isActive) && (
                    <Link className={'dropdown-item text--body'} to={`/auctions/${auction.id}/title`}>
                      Edit
                    </Link>
                  )}
                  {auction.isDraft && (
                    <DeleteAuctionButton
                      auction={auction}
                      className={clsx(styles.actionBtn, 'dropdown-item text--body')}
                      mutation={DeleteAuctionMutation}
                    />
                  )}
                  {(auction.isActive || auction.isStopped) && (
                    <StopOrActiveButton
                      auction={auction}
                      className={clsx(styles.actionBtn, 'dropdown-item text--body')}
                      mutation={auction.isStopped ? ActivateAuctionMutation : StopAuctionMutation}
                    />
                  )}
                  {auction.isActive && (
                    <FairMarketValueChangeButton
                      auction={auction}
                      className={clsx(styles.actionBtn, 'dropdown-item text--body')}
                      getAuctionsList={getAuctionsList}
                      mutation={UpdateAuctionMutation}
                    />
                  )}
                  {(!auction.delivery.status || auction.delivery.status !== AuctionDeliveryStatus.ADDRESS_PROVIDED) && (
                    <EditDeliveryParcelButton
                      auction={auction}
                      className={clsx(styles.actionBtn, 'dropdown-item text--body')}
                      getAuctionsList={getAuctionsList}
                      mutation={UpdateAuctionParcelMutation}
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
