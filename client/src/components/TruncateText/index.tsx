import { useState, useEffect, useRef, FC } from 'react';

import clsx from 'clsx';

import styles from './styles.module.scss';

type Props = {
  lines: number;
  withMoreButton?: boolean;
  darkBackgroundColor?: string;
  children?: string;
};

const TruncateText: FC<Props> = ({ children, lines, withMoreButton = false }) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const handleExpand = () => setOpen(true);

  const handleRollback = () => setOpen(false);

  useEffect(() => {
    const element = ref.current;

    if (element) {
      const handler = () => {
        const { clientHeight, scrollHeight } = element;
        // scrollHeight different results in firefox/chrome for uncut element
        setIsTruncated(scrollHeight - clientHeight > 2);
      };

      const observer = new MutationObserver(handler);

      const config = {
        attributes: true,
        childList: true,
        characterData: true,
      };

      observer.observe(element, config);

      handler();

      return () => observer.disconnect();
    }
  }, []);

  return (
    <span className={styles.root}>
      <span ref={ref} className={styles.text} style={{ WebkitLineClamp: open ? undefined : lines }}>
        {children}
      </span>

      {isTruncated && withMoreButton ? (
        <span className={clsx(styles.more, 'text--body')} onClick={handleExpand}>
          Read more.
        </span>
      ) : (
        <span className={clsx(styles.more, 'text--body')} onClick={handleRollback}>
          Roll back
        </span>
      )}
    </span>
  );
};

export default TruncateText;
