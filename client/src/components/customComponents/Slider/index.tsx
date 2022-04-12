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

  const canScrollTo = useCallback(
    (type: string): boolean => {
      if (!slider.current) return false;

      const itemIndex = type === 'next' ? items.length - 1 : 0;
      const item = slider.current.innerSlider.list.querySelector(`[data-index="${itemIndex}"]`);
      const rect = item.getBoundingClientRect();
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;

      return type === 'next' ? rect.right > windowWidth : rect.left < 0;
    },
    [slider, items],
  );
  const checkArrow = useCallback(
    (type: string) => {
      if (!slider.current || !sliderWrapper.current) return;

      const arrow = sliderWrapper.current.querySelector(`.slick-${type}`);
      if (!arrow) return;

      const disable = !canScrollTo(type);

      arrow.disabled = disable;

      if (disable) {
        arrow.classList.add('slick-disabled');
      } else {
        arrow.classList.remove('slick-disabled');
      }
    },
    [canScrollTo],
  );
  const checkArrows = useCallback(() => {
    checkArrow('next');
    checkArrow('prev');
  }, [checkArrow]);
  const scroll = useCallback(
    (event) => {
      if (!slider.current || !sliderWrapper.current) return;
      if (event.deltaY !== 0) return;
      if (!sliderWrapper.current.contains(event.target)) return;

      event.wheelDelta > 0
        ? canScrollTo('next') && slider.current.slickNext()
        : canScrollTo('prev') && slider.current.slickPrev();
    },
    [canScrollTo],
  );

  useEffect(() => {
    checkArrows();
    window.addEventListener('resize', checkArrows);
    window.addEventListener('wheel', scroll);

    return () => {
      window.removeEventListener('resize', checkArrows);
      window.removeEventListener('wheel', scroll);
    };
  }, [checkArrows, scroll]);

  const settings = {
    infinite: false,
    ref: slider,
    speed: 500,
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
