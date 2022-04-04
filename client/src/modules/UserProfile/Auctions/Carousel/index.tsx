import { FC, ReactElement } from 'react';

import { Spinner } from 'react-bootstrap';

import Slider from 'src/components/customComponents/Slider';

interface Props {
  auctions: ReactElement[];
  emptyText: string;
  loading: boolean;
  title: string;
}

const Сarousel: FC<Props> = ({ auctions, emptyText, loading, title }) => {
  return (
    <div className="mb-5">
      <span className="label-with-separator text-label mb-4 d-block ">{title}</span>
      {loading ? <Spinner animation="border" /> : auctions?.length ? <Slider items={auctions} /> : <p>{emptyText}</p>}
    </div>
  );
};

export default Сarousel;
