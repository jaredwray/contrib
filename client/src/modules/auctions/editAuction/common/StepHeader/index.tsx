import React, { FC } from 'react';

import cn from 'clsx';

import styles from './styles.module.scss';

interface Props {
  step: string | null;
  title: string;
  className?: string;
}

const StepHeader: FC<Props> = ({ step, title, className }) => (
  <div className={styles.root}>
    <p className="text-label label-with-separator">Auction an item</p>
    <div className={cn(styles.title, className)}>
      <span className="text-headline">{title}</span>
      {step && <span className={cn(styles.step, 'text-headline')}>Step {step}</span>}
    </div>
  </div>
);

export default StepHeader;
