import { FC } from 'react';

import { format } from 'date-fns-tz';
import Dinero from 'dinero.js';
import { Row, Table, Button } from 'react-bootstrap';

import { getShortLink } from 'src/helpers/getShortLink';
import { Auction } from 'src/types/Auction';
import { Charity } from 'src/types/Charity';

import styles from './styles.module.scss';

interface Props {
  auction: Auction;
  charity: Charity;
  showEditButton: boolean;
  handleEditClick: () => void;
}

export const Details: FC<Props> = ({ auction, charity, showEditButton, handleEditClick }) => {
  const auctionStartDate = format(new Date(auction.startDate), 'MMM dd yyyy HH:mm:ssXXX');
  const auctionEndDate = format(new Date(auction.endDate), 'MMM dd yyyy HH:mm:ssXXX');

  return (
    <Row className={styles.tableContainer}>
      <Table className="d-table d-sm-block">
        <tbody className="fw-normal table-bordered pb-3 text-break">
          <tr>
            <td>Id</td>
            <td>{auction.id}</td>
          </tr>
          <tr>
            <td>Title</td>
            <td>{auction.title}</td>
          </tr>
          {auction?.bitlyLink && (
            <tr>
              <td>Bitly Link</td>
              <td>{auction.bitlyLink}</td>
            </tr>
          )}
          <tr>
            <td>Short Link</td>
            <td>{getShortLink(auction.shortLink.slug)}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>{auction.status}</td>
          </tr>
          <tr>
            <td>Start Price</td>
            <td>{Dinero(auction.startPrice).toFormat('$0,0')}</td>
          </tr>
          <tr>
            <td>Current Price</td>
            <td>{Dinero(auction.currentPrice).toFormat('$0,0')}</td>
          </tr>
          <tr>
            <td>Bid Step Price</td>
            <td>{Dinero(auction.bidStep).toFormat('$0,0')}</td>
          </tr>
          {auction.fairMarketValue && (
            <tr>
              <td className="align-middle">Fair Market Value</td>
              <td className={styles.wrapper}>
                {Dinero(auction.fairMarketValue).toFormat('$0,0')}
                {showEditButton && (
                  <Button className={styles.editButton} variant="secondary" onClick={handleEditClick}>
                    Edit
                  </Button>
                )}
              </td>
            </tr>
          )}
          <tr>
            <td>Start date</td>
            <td>{auctionStartDate}</td>
          </tr>
          <tr>
            <td>End date</td>
            <td>{auctionEndDate}</td>
          </tr>
          <tr>
            <td>Charity Name</td>
            <td>{charity ? charity.name : 'no charity chosen yet'}</td>
          </tr>
          <tr>
            <td>Charity id</td>
            <td>{charity ? charity.id : 'no charity chosen yet'}</td>
          </tr>
          <tr>
            <td>Influencer Name</td>
            <td>{auction.auctionOrganizer.name}</td>
          </tr>
          <tr>
            <td>Influencer id</td>
            <td>{auction.auctionOrganizer.id}</td>
          </tr>
          {auction.isStopped && (
            <tr>
              <td>Stop date</td>
              <td>{auction.stoppedAt}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Row>
  );
};

export default Details;
