import { FC } from 'react';

import Dinero from 'dinero.js';

interface Props {
  value: Dinero.DineroObject;
}

export const TotalRaisedAmount: FC<Props> = ({ value }) => (
  <p className="text-label text-all-cups">Total amount raised: {Dinero(value).toFormat('$0,0')}</p>
);
