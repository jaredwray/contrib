import { FC, useState, useCallback } from 'react';

import Nouislider from 'nouislider-react';
import { Form } from 'react-bootstrap';
import NumberFormat from 'react-number-format';

import './nouislider.scss';

interface Props {
  initialBids: any;
  bids: any;
  changeFilters: (key: string, value: any) => void;
}

const PriceRange: FC<Props> = ({ initialBids, bids, changeFilters }) => {
  const [priceRange, setPriceRange] = useState(initialBids);

  const onSliderUpdate = useCallback((values: string[]) => {
    setPriceRange({ minPrice: values[0], maxPrice: values[1] });
  }, []);
  const onSliderChange = useCallback(
    (values: string[]) => {
      changeFilters('bids', { minPrice: parseInt(values[0]), maxPrice: parseInt(values[1]) });
    },
    [changeFilters],
  );

  if (!initialBids) return null;

  return (
    <Form.Group>
      <Form.Label>Price range</Form.Label>
      <Nouislider
        connect
        range={{
          min: initialBids.minPrice,
          max: initialBids.minPrice === initialBids.maxPrice ? initialBids.maxPrice + 0.1 : initialBids.maxPrice,
        }}
        start={[bids?.minPrice, bids?.maxPrice]}
        step={1}
        onChange={onSliderChange}
        onUpdate={onSliderUpdate}
      />
      <div className="text-label text-all-cups">
        <span className="float-start">
          <NumberFormat
            decimalScale={0}
            displayType={'text'}
            prefix={'from $'}
            thousandSeparator={true}
            value={priceRange?.minPrice}
          />
        </span>
        <span className="float-end">
          <NumberFormat
            decimalScale={0}
            displayType="text"
            prefix="to $"
            thousandSeparator={true}
            value={priceRange?.maxPrice}
          />
        </span>
      </div>
    </Form.Group>
  );
};

export default PriceRange;
