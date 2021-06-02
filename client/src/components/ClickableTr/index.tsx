import { useRef, ReactNode } from 'react';

import { useHistory } from 'react-router-dom';

interface Props {
  children: ReactNode;
  className: string;
  collection: string;
  item: any;
}

const ClickableTr = ({ children, className, collection, item }: Props) => {
  const moveState = useRef({ x: 0 });
  const history = useHistory();
  const handleMouseDown = (event: MouseEvent) => {
    moveState.current.x = event.screenX;
  };
  const handleSelect = (item: any, event: MouseEvent) => {
    if (!(event.target as Element).closest('a, button, .modal') && event.screenX === moveState.current.x) {
      history.push(`/${collection}/${item.id}`);
    }
  };

  return (
    <tr
      className={className}
      onClick={(event: any) => handleSelect(item, event)}
      onMouseDown={(event: any) => handleMouseDown(event)}
    >
      {children}
    </tr>
  );
};

export default ClickableTr;
