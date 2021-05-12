import { FC } from 'react';

import Slider from 'src/components/Slider';

interface Props {
  name: String;
  items: Object[];
  status: String;
}
export const InfluencerProfileSliderRow: FC<Props> = ({ name, items, status }) => {
  return (
    <div className="mb-5">
      <span className="label-with-separator text-label mb-4 d-block ">
        {name}'s {status} auctions
      </span>
      <Slider items={items} />
    </div>
  );
};
