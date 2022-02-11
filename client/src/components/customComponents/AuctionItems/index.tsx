import { FC } from 'react';

import Dinero from 'dinero.js';

import { AuctionItem } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  items: AuctionItem[];
}

export const AuctionItems: FC<Props> = ({ items }) => {
  return (
    <>
      <p className="mb-3 text-subhead">Auction Items:</p>
      {items.map(({ id, name, contributor, fairMarketValue }) => (
        <div key={id} className={styles.auctionItemContainer}>
          <p>{name}</p>
          <p>
            Contributor: <span>{contributor}</span>
          </p>
          <p>
            Fair market value: <span>{Dinero(fairMarketValue).toFormat('$0,0')}</span>
          </p>
        </div>
      ))}
    </>
  );
};

export default AuctionItems;
