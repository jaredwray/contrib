import { FC, useState } from 'react';

import clsx from 'clsx';
import LinesEllipsis from 'react-lines-ellipsis';

import styles from './styles.module.scss';

const LINES_PER_PAGE = 6;

interface Props {
  text?: string | null;
  linkClassName?: string;
  textClassName?: string;
}
export const ReadMore: FC<Props> = ({ text, linkClassName, textClassName }) => {
  const [readMore, setReadMore] = useState(LINES_PER_PAGE);
  const [isClamped, setClamped] = useState(false);

  const isShortDescription = readMore === LINES_PER_PAGE;

  const handleClick = () => {
    setReadMore(isShortDescription ? Infinity : LINES_PER_PAGE);
  };

  const formattedText =
    text &&
    text
      .split('\n')
      .filter((paragraph: string) => paragraph !== '')
      .join('\n\n');

  const reflow = (rleState: any) => {
    rleState.clamped && setClamped(rleState.clamped);
  };
  return text ? (
    <div className="p-0">
      <div className={textClassName}>
        <LinesEllipsis
          basedOn="words"
          ellipsis="..."
          maxLine={readMore}
          style={{ fontWeight: 'normal', whiteSpace: 'break-spaces' }}
          text={formattedText || ''}
          onReflow={reflow}
        />
      </div>
      {isClamped && (
        <span className={clsx(styles.readMoreBtn, linkClassName)} data-test-id="read_more_btn" onClick={handleClick}>
          Read {isShortDescription ? 'more' : 'less'}.
        </span>
      )}
    </div>
  ) : (
    <p className={styles.noDescription}>no description</p>
  );
};
