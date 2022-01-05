import { FC } from 'react';

import Loading from 'src/components/customComponents/Loading';

interface Props {
  name: string;
}

export const AuctionsInfoLoading: FC<Props> = ({ name }) => {
  return (
    <div className="mb-5">
      <span className="label-with-separator text-label mb-4 d-block">{name}'s auctions</span>
      <Loading />
    </div>
  );
};
