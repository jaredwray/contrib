import { FC, ReactElement } from 'react';

import clsx from 'clsx';
import { Table } from 'react-bootstrap';

import { MIN_BID_STEP_VALUE } from 'src/constants';

import { IFormError } from '../../IFormState';
import Item from './Item';
import styles from './styles.module.scss';

interface Props {
  errors?: IFormError;
  disabled?: boolean;
  checkMissed: (name: string, value: string | Dinero.DineroObject) => void;
}

const Prices: FC<Props> = ({ disabled, checkMissed, errors }): ReactElement => {
  return (
    <div className={styles.wrapper}>
      <Table borderless responsive className={clsx(styles.table, 'm-0')}>
        <tbody>
          <Item
            required
            checkMissed={checkMissed}
            disabled={disabled}
            error={errors?.startPrice}
            label="Starting Bid Price"
            name="startPrice"
            placeholder={100}
            tooltip="The starting price for the item which determines the minimum amount that can be bid. The item will not sell if no bids at or above this price are received."
          />
          <Item
            required
            checkMissed={checkMissed}
            disabled={disabled}
            error={errors?.fairMarketValue}
            label="Fair Market Value"
            name="fairMarketValue"
            placeholder="required"
            tooltip="The fair market value is the price something would sell for on the open market. A good example of this is a jersey signed or not would have a fair market value of $99 dollars which is what it is online."
          />
          <Item
            disabled={disabled}
            error={errors?.bidStep}
            label="Minimum Bid Increment"
            minValue={10}
            name="bidStep"
            placeholder={10}
            tooltip={`The bids step price for the item which determines the minimum price increase for the next bid. Minimum value is $${MIN_BID_STEP_VALUE}.`}
          />
          <Item
            disabled={disabled}
            error={errors?.itemPrice}
            label="Buy It Now Price"
            name="itemPrice"
            placeholder={0}
            tooltip="We usually suggested making the 'Buy it now' button 20x what you starting price is so that bidders have to ability to purchase the item before the auction time closes. If you do not want a 'Buy it Now' option just enter $0"
          />
        </tbody>
      </Table>
    </div>
  );
};

export default Prices;
