import { FC, useState } from 'react';

import LinesEllipsis from 'react-lines-ellipsis';

import styles from './styles.module.scss';

const LINES_PER_PAGE = 6;

interface Props {
  text?: string | null;
}
export const ReadMore: FC<Props> = ({ text }) => {
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
    <>
      <LinesEllipsis
        basedOn="words"
        ellipsis="..."
        maxLine={readMore}
        style={{ fontWeight: 'normal', whiteSpace: 'break-spaces', paddingBottom: '15px' }}
        text={formattedText || ''}
        onReflow={reflow}
      />
      {isClamped && (
        <span className={styles.readMoreBtn} data-test-id="read_more_btn" onClick={handleClick}>
          Read {isShortDescription ? 'more' : 'less'}.
        </span>
      )}
    </>
  ) : (
    <p className={styles.noDescription}>no description</p>
  );
};
