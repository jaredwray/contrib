import { FC } from 'react';

import Slider from 'src/components/Slider';

interface Props {
  items: Object[];
}
export const ProfileSliderRow: FC<Props> = ({ items, children }) => {
  return (
    <div className="mb-5">
      <span className="label-with-separator text-label mb-4 d-block ">{children}</span>
      <Slider items={items} />
    </div>
  );
};
