import { useState, useEffect, useCallback } from 'react';

import { useLazyQuery } from '@apollo/client';
import clsx from 'clsx';
import Dinero from 'dinero.js';
import { Table } from 'react-bootstrap';
import { Link, useHistory, useLocation } from 'react-router-dom';

import {
  AuctionsListQuery,
  UpdateAuctionMutation,
  StopAuctionMutation,
  ActivateAuctionMutation,
  DeleteAuctionMutation,
} from 'src/apollo/queries/auctions';
import { PER_PAGE } from 'src/components/custom/Pagination';
import { ActionsDropdown } from 'src/components/forms/selects/ActionsDropdown';
import { AdminPage } from 'src/components/layouts/AdminPage';
import ClickableTr from 'src/components/wrappers/ClickableTr';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useUrlQueryParams } from 'src/helpers/useUrlQueryParams';
import { Auction } from 'src/types/Auction';

import { BidStepValueChangeButton } from './BidStepValueChangeButton';
import { DeleteAuctionButton } from './DeleteAuctionButton';
import { StopOrActiveButton } from './StopOrActiveButton';
import styles from './styles.module.scss';

export default function AdminAuctionsPage() {
  const history = useHistory();
  const { pathname } = useLocation();

  const page = Number(useUrlQueryParams().get('p'));
  const query = useUrlQueryParams().get('q');
  const [searchQuery, setSearchQuery] = useState<string>(query || '');

  const initialSkip = !page || page === 1 ? 0 : (page - 1) * PER_PAGE;
  const [pageSkip, setPageSkip] = useState(initialSkip);

  const [getAuctionsList, { loading, data, error }] = useLazyQuery(AuctionsListQuery, {
    variables: {
      size: PER_PAGE,
      skip: initialSkip,
      query: searchQuery,
    },
    fetchPolicy: 'cache-and-network',
  });
  useEffect(() => {
    setSearchQuery(query || '');
    getAuctionsList();
  }, [getAuctionsList, query]);

  const clearAndCloseSearch = useCallback(() => {
    setSearchQuery('');
    history.push(pathname);
  }, [setSearchQuery, history, pathname]);

  const onInputSearchChange = useCallback(
    (value) => {
      setSearchQuery(value);
      setPageSkip(0);

      history.push(`${pathname}${value && `?q=${value}`}`);
    },
    [setSearchQuery, history, pathname],
  );

  if (error) return null;

  const auctions = data?.auctions || { skip: 0, totalItems: 0, items: [] };

  setPageTitle('Auctions page');

  return (
    <AdminPage
      items={auctions}
      loading={loading}
      pageSkip={pageSkip}
      searchQuery={query ?? ''}
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
            <th className={styles.status}>Status</th>
            <th className={styles.price}>Price</th>
            <th className={styles.price}>Bid Step</th>
            <th className={styles.actions}></th>
          </tr>
        </thead>
        <tbody className="fw-normal">
          {auctions.items.map((auction: Auction) => (
            <ClickableTr
              key={auction.id}
              className={clsx(auction.password && styles.private)}
              linkTo={`/auctions/${auction.isDraft ? `${auction.id}/title` : auction.id}`}
            >
              <td className={styles.idColumn}>{auction.id}</td>
              <td className={styles.otherColumns}>{auction.title}</td>
              <td className={styles.otherColumns}>{auction.auctionOrganizer.name}</td>
              <td>{auction.status}</td>
              <td>{Dinero(auction.currentPrice ?? auction.startPrice).toFormat('$0,0')}</td>
              <td>{Dinero(auction.bidStep).toFormat('$0,0')}</td>
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
                  {(auction.isSettled || auction.isSold) && (
                    <Link className="dropdown-item text--body" to={`/auctions/${auction.id}/delivery/info`}>
                      Delivery info page
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
                  {!auction.isSold && !auction.isSettled && (
                    <BidStepValueChangeButton
                      auction={auction}
                      className={clsx(styles.actionBtn, 'dropdown-item text--body')}
                      getAuctionsList={getAuctionsList}
                      mutation={UpdateAuctionMutation}
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
