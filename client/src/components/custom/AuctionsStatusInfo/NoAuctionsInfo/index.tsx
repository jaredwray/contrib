import { FC } from 'react';

interface Props {
  name: string;
}
export const NoAuctionsInfo: FC<Props> = ({ name }) => {
  return (
    <div className="mb-5">
      <span className="label-with-separator text-label mb-4 d-block">{name}'s auctions</span>
      <p className="text-label">no auctions yet</p>
    </div>
  );
};
