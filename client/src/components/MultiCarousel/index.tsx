import { FC } from 'react';

import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import './carousel.scss';

interface Props {
  items: any[];
}

const MultiCarousel: FC<Props> = ({ items }) => {
  const settings = {
    infinite: true,
    swipeToSlide: true,
    variableWidth: true,
  };
  return (
    <div className="multi-carousel">
      <Slider {...settings}>{items}</Slider>
    </div>
  );
};

export default MultiCarousel;
