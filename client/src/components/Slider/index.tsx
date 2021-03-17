import { FC } from 'react';

import RSlider from 'react-slick';

import 'slick-carousel/slick/slick.css';

interface Props {
  items: any[];
}

const Slider: FC<Props> = ({ items }) => {
  const settings = {
    infinite: true,
    swipeToSlide: true,
    variableWidth: true,
  };
  return (
    <div className="multi-carousel">
      <RSlider {...settings}>{items}</RSlider>
    </div>
  );
};

export default Slider;
