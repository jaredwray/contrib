import { FC } from 'react';

import { format, utcToZonedTime } from 'date-fns-tz';
import Dinero from 'dinero.js';
import { Table } from 'react-bootstrap';

import { Auction } from 'src/types/Auction';
import { Charity } from 'src/types/Charity';

interface Props {
  auction: Auction;
  charity: Charity;
  timeZone: string;
}

export const Details: FC<Props> = ({ auction, timeZone, charity }) => {
  const auctionStartDate = format(utcToZonedTime(auction.startDate, timeZone), 'MMM dd yyyy HH:mm:ssXXX');
  const auctionEndDate = format(utcToZonedTime(auction.endDate, timeZone), 'MMM dd yyyy HH:mm:ssXXX');

  return (
    <Table className="d-inline table-bordered">
      <tbody className="font-weight-normal">
        <tr>
          <td>Id</td>
          <td>{auction.id}</td>
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
        {auction.fairMarketValue && (
          <tr>
            <td>Fair Market Value</td>
            <td>{Dinero(auction.fairMarketValue).toFormat('$0,0')}</td>
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
  );
};

export default Details;
