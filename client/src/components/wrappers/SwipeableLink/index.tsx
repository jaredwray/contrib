import { useRef, ReactNode } from 'react';

import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  className?: string;
  to: string;
  title?: string;
}

const SwipeableLink = ({ children, className, to, title }: Props) => {
  const state = useRef({ x: 0 });
  const handleMouseDown = (e: any) => {
    state.current.x = e.screenX;
  };
  const handleClick = (e: any) => {
    if (e.screenX !== state.current.x) e.preventDefault();
  };

  return (
    <Link
      className={className}
      draggable={false}
      title={title}
      to={to}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      {children}
    </Link>
  );
};

export default SwipeableLink;
