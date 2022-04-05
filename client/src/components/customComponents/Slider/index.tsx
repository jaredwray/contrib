import { FC, ReactElement, useRef, useEffect, useCallback } from 'react';

import RSlider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import './slider.scss';

interface Props {
  items: ReactElement[];
}

const Slider: FC<Props> = ({ items }) => {
  const slider = useRef() as React.MutableRefObject<any>;
  const sliderWrapper = useRef() as React.MutableRefObject<any>;

  const checkArrow = useCallback(
    (type: string) => {
      if (!slider.current) return;

      const arrow = sliderWrapper.current.querySelector(`.slick-${type}`);
      if (!arrow) return;

      const itemIndex = type === 'next' ? items.length - 1 : 0;
      const item = slider.current.innerSlider.list.querySelector(`[data-index="${itemIndex}"]`);
      const rect = item.getBoundingClientRect();
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;
      const disable = type === 'next' ? rect.right <= windowWidth : rect.left >= 0;

      arrow.disabled = disable;

      if (disable) {
        arrow.classList.add('slick-disabled');
      } else {
        arrow.classList.remove('slick-disabled');
      }
    },
    [items.length],
  );

  const checkArrows = useCallback(() => {
    checkArrow('next');
    checkArrow('prev');
  }, [checkArrow]);

  useEffect(() => {
    checkArrows();
    window.addEventListener('resize', checkArrows);
    return () => window.removeEventListener('resize', checkArrows);
  }, [checkArrows]);

  const settings = {
    infinite: false,
    ref: slider,
    speed: 300,
    swipeToSlide: true,
    variableWidth: true,
    afterChange: checkArrows,
  };

  if (!items.length) return null;

  return (
    <div ref={sliderWrapper} className="multi-carousel">
      <RSlider {...settings}>{items}</RSlider>
    </div>
  );
};

export default Slider;
