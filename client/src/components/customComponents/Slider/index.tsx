import { FC, useState, useEffect } from 'react';

import RSlider from 'react-slick';

import 'slick-carousel/slick/slick.css';

interface Props {
  items: any[];
}

const Slider: FC<Props> = ({ items }) => {
  function getWindowWidth() {
    const { innerWidth: width } = window;
    return width;
  }
  const [windowWidth, setWindowWidth] = useState(getWindowWidth());

  useEffect(() => {
    function handleResize() {
      setWindowWidth(getWindowWidth());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const settings = {
    infinite: true,
    swipeToSlide: true,
    variableWidth: true,
    slidesToShow: items.length <= Math.round(windowWidth / 500) ? items.length : 1,
  };

  if (!items.length) {
    return null;
  }

  return (
    <div className="multi-carousel">
      <RSlider {...settings}>{items}</RSlider>
    </div>
  );
};

export default Slider;
