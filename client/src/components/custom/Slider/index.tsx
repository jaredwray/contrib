import { FC, ReactElement, useRef, useState, useEffect, useCallback } from 'react';

import RSlider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import './slider.scss';

interface Props {
  items: ReactElement[];
}

const Slider: FC<Props> = ({ items }) => {
  const slider = useRef() as React.MutableRefObject<any>;
  const sliderWrapper = useRef() as React.MutableRefObject<any>;
  const [changing, isChanging] = useState(false);

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
  const preventDefault = useCallback(
    (event: WheelEvent) => {
      if (!sliderWrapper.current?.contains(event.target)) return;

      checkArrows();
      const activeArrow = sliderWrapper.current.querySelector(`.slick-arrow:not(.slick-disabled)`);
      if (!activeArrow && !changing) return;

      event.preventDefault();
    },
    [changing, sliderWrapper, checkArrows],
  );

  useEffect(() => {
    window.addEventListener('resize', checkArrows);
    // window.addEventListener('wheel', preventDefault, { passive: false });

    return () => {
      window.removeEventListener('resize', checkArrows);
      // window.removeEventListener('wheel', preventDefault);
    };
  }, [checkArrows, preventDefault]);

  const settings = {
    infinite: false,
    ref: slider,
    speed: 500,
    swipeToSlide: true,
    variableWidth: true,
    beforeChange: (current: number, next: number) => {
      isChanging(true);
      checkArrows();
    },
    afterChange: () => {
      isChanging(false);
      checkArrows();
    },
  };

  if (!items.length) return null;

  return (
    <div ref={sliderWrapper} className="multi-carousel">
      <RSlider {...settings}>{items}</RSlider>
    </div>
  );
};

export default Slider;
