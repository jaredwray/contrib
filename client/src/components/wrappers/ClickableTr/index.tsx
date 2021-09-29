import { useRef, ReactNode } from 'react';

import clsx from 'clsx';
import { useHistory } from 'react-router-dom';

interface Props {
  children: ReactNode;
  linkTo: string;
  className?: string;
}

const ClickableTr = ({ children, className, linkTo }: Props) => {
  const moveState = useRef({ x: 0 });
  const history = useHistory();
  const handleMouseDown = (event: MouseEvent) => {
    moveState.current.x = event.screenX;
  };
  const handleSelect = (event: MouseEvent) => {
    if (!(event.target as Element).closest('a, button, .modal') && event.screenX === moveState.current.x) {
      history.push(linkTo);
    }
  };

  return (
    <tr
      className={clsx(className, 'clickable')}
      onClick={(event: any) => handleSelect(event)}
      onMouseDown={(event: any) => handleMouseDown(event)}
    >
      {children}
    </tr>
  );
};

export default ClickableTr;
